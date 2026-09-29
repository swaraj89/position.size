export const defaults = {
  capital: "10000",
  allocation: "50",
  risk: "2.5",
  entry: "1000",
  stop: "990",
};

// Parse decimal input into hundredths without floating-point multiplication.
function hundredths(value) {
  const text = String(value).trim();
  if (!/^\d+(\.\d{0,2})?$/.test(text)) return null;
  const [whole, fraction = ""] = text.split(".");
  const result = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(result) && result <= 1_000_000_000_000
    ? result
    : null;
}

export function calculatePosition(input) {
  const errors = {};
  const values = {};
  for (const key of Object.keys(defaults)) {
    values[key] = hundredths(input[key] ?? "");
    if (values[key] === null)
      errors[key] =
        "Enter a non-negative number with up to 2 decimals (maximum 10 billion).";
  }
  for (const key of ["capital", "entry"]) {
    if (values[key] === 0) errors[key] = "Enter an amount greater than zero.";
  }
  for (const key of ["risk", "allocation"]) {
    if (values[key] !== null && values[key] > 10000)
      errors[key] = "Enter a percentage from 0 to 100.";
  }
  if (
    values.stop !== null &&
    values.entry !== null &&
    values.stop >= values.entry
  ) {
    errors.stop = "Stop loss must be below the entry price for a long trade.";
  }
  if (Object.keys(errors).length) return { errors, result: null };

  const { capital, allocation, risk, entry, stop } = values;
  // BigInt keeps percentage multiplication exact even for large portfolios.
  const budget = Number((BigInt(capital) * BigInt(risk)) / 10000n);
  const cap = Number((BigInt(capital) * BigInt(allocation)) / 10000n);
  const distance = entry - stop;
  const riskQuantity = Math.floor(budget / distance);
  const allocationQuantity = Math.floor(cap / entry);
  const quantity = Math.min(riskQuantity, allocationQuantity);
  return {
    errors,
    result: {
      quantity,
      cost: (quantity * entry) / 100,
      loss: (quantity * distance) / 100,
      remaining: (capital - quantity * entry) / 100,
      budget: budget / 100,
      cap: cap / 100,
      distance: distance / 100,
      stopPercent: (distance / entry) * 100,
      allocationUsed: ((quantity * entry) / capital) * 100,
      riskUsed: ((quantity * distance) / capital) * 100,
      constraint:
        riskQuantity < allocationQuantity
          ? "Risk budget"
          : riskQuantity > allocationQuantity
            ? "Allocation cap"
            : "Both limits",
    },
  };
}
