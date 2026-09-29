import test from "node:test";
import assert from "node:assert/strict";
import { calculatePosition, defaults } from "../src/util/sizerUtil.js";

const calculate = (changes = {}) =>
  calculatePosition({ ...defaults, ...changes });

test("preserves defaults and reports allocation as the binding limit", () => {
  const { result } = calculate();
  assert.equal(result.quantity, 5);
  assert.equal(result.cost, 5000);
  assert.equal(result.loss, 50);
  assert.equal(result.constraint, "Allocation cap");
});
test("risk-bound sizing, zero budgets, and unaffordable entries", () => {
  assert.equal(calculate({ stop: "900", risk: "1" }).result.quantity, 1);
  for (const changes of [
    { risk: "0" },
    { allocation: "0" },
    { capital: "1" },
  ]) {
    assert.equal(calculate(changes).result.quantity, 0);
  }
  assert.equal(calculate({ stop: "0" }).result.quantity, 0);
});
test("rejects blank, invalid, negative, over-precision and unsafe values", () => {
  for (const value of [
    "",
    "-1",
    "Infinity",
    "NaN",
    "1.234",
    "10000000001",
    "1e3",
  ]) {
    for (const key of Object.keys(defaults)) {
      const { errors, result } = calculate({ [key]: value });
      assert.ok(errors[key], `${key}: ${value}`);
      assert.equal(result, null);
    }
  }
  for (const changes of [
    { capital: "0" },
    { entry: "0" },
    { stop: "1000" },
    { stop: "1001" },
    { risk: "101" },
    { allocation: "101" },
  ]) {
    assert.equal(calculate(changes).result, null);
  }
});
test("sub-rupee stop distances terminate and decimal budgets round down", () => {
  const { result } = calculate({
    capital: "100",
    allocation: "100",
    risk: "1",
    entry: "0.30",
    stop: "0.29",
  });
  assert.equal(result.quantity, 100);
  assert.equal(result.loss, 1);
  assert.equal(
    calculate({ capital: "100.01", risk: "0.01" }).result.budget,
    0.01,
  );
});
test("whole-share quantity is maximal and respects both limits across varied inputs", () => {
  for (const capital of ["100.01", "10000", "9999999999.99"]) {
    for (const entry of ["0.03", "100", "1234.56"]) {
      for (const risk of ["0", "0.01", "1", "100"]) {
        const { result: r } = calculate({
          capital,
          entry,
          stop: "0.01",
          risk,
          allocation: "37.25",
        });
        assert.ok(Number.isSafeInteger(r.quantity) && r.quantity >= 0);
        assert.ok(r.cost <= r.cap);
        assert.ok(r.loss <= r.budget);
        assert.ok(
          (r.quantity + 1) * Number(entry) > r.cap ||
            (r.quantity + 1) * r.distance > r.budget,
        );
      }
    }
  }
});
