import { describe, it, expect, vi } from "vitest";
import {
  createInitialState,
  normalizeNumberString,
  formatResult,
  compute,
  inputDigit,
  inputDot,
  backspace,
  toggleSign,
  percent,
  chooseOp,
  equals,
  calculateAndFormat,
} from "../src/calculator.js";

describe("Calculator unit tests", () => {
  it("normalizeNumberString прибирає зайві нулі", () => {
    expect(normalizeNumberString("00012")).toBe("12");
  });

  it("normalizeNumberString зберігає десяткову частину", () => {
    expect(normalizeNumberString("000.5")).toBe("0.5");
  });

  it("compute правильно додає числа", () => {
    expect(compute(2, 3, "+")).toBe(5);
  });

  it("compute правильно множить числа", () => {
    expect(compute(4, 5, "*")).toBe(20);
  });

  it("compute повертає NaN при діленні на нуль", () => {
    expect(Number.isNaN(compute(10, 0, "/"))).toBe(true);
  });

  it("formatResult повертає Error для некоректного числа", () => {
    expect(formatResult(NaN)).toBe("Error");
  });

  it("inputDigit замінює 0 на введену цифру", () => {
    const state = createInitialState();
    const next = inputDigit(state, "7");

    expect(next.current).toBe("7");
  });

  it("inputDot додає крапку лише один раз", () => {
    let state = createInitialState();
    state = inputDigit(state, "5");
    state = inputDot(state);
    state = inputDot(state);

    expect(state.current).toBe("5.");
  });

  it("backspace видаляє останній символ", () => {
    let state = createInitialState();
    state = inputDigit(state, "1");
    state = inputDigit(state, "2");
    state = inputDigit(state, "3");

    const next = backspace(state);

    expect(next.current).toBe("12");
  });

  it("toggleSign змінює знак числа", () => {
    let state = createInitialState();
    state = inputDigit(state, "8");

    const next = toggleSign(state);

    expect(next.current).toBe("-8");
  });

  it("percent переводить число у відсоток", () => {
    let state = createInitialState();
    state = inputDigit(state, "5");
    state = inputDigit(state, "0");

    const next = percent(state);

    expect(next.current).toBe("0.5");
  });

  it("chooseOp + equals правильно виконують обчислення", () => {
    let state = createInitialState();

    state = inputDigit(state, "8");
    state = chooseOp(state, "+");
    state = inputDigit(state, "2");
    state = equals(state);

    expect(state.current).toBe("10");
    expect(state.op).toBe(null);
  });

  it("mock formatter ізолює логіку форматування", () => {
    const mockFormatter = vi.fn((value) => `Result: ${value}`);

    const result = calculateAndFormat(2, 3, "+", mockFormatter);

    expect(mockFormatter).toHaveBeenCalledTimes(1);
    expect(mockFormatter).toHaveBeenCalledWith(5);
    expect(result).toBe("Result: 5");
  });
});