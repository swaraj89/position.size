export function getPositionSize(maxRisk, riskPerShare) {
  return Math.floor(maxRisk / riskPerShare);
}

export function isCostGreaterThanMaxCost(totalPrice, maxCost) {
  return totalPrice > maxCost;
}

export function computeCost(qty, cmp) {
  return qty * cmp;
}

export function getExtraQty(currentCost, maxCost, riskPerShare) {
  const costDiff = currentCost - maxCost;
  const extraQty = costDiff / riskPerShare;

  return Math.floor(costDiff / extraQty);
}

export function getValueOfCapital(capital, percent) {
  return (percent / 100) * capital;
}
