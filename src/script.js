"use strict";

import {
  createInitialState,
  normalizeNumberString,
  inputDigit,
  inputDot,
  clearAll,
  backspace,
  toggleSign,
  percent,
  chooseOp,
  equals,
} from "./calculator.js";
const statusEl = document.getElementById("app-status");

if (statusEl) {
  statusEl.textContent = import.meta.env.VITE_APP_STATUS;
}

const display = document.getElementById("display");
const keys = document.querySelector(".keys");

let state = createInitialState();

function render() {
  display.value = state.current;
}

keys.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const digit = btn.dataset.digit;
  const operator = btn.dataset.op;
  const action = btn.dataset.action;

  if (digit) state = inputDigit(state, digit);
  else if (operator) state = chooseOp(state, operator);
  else if (action === "dot") state = inputDot(state);
  else if (action === "equals") state = equals(state);
  else if (action === "clear") state = clearAll();
  else if (action === "back") state = backspace(state);
  else if (action === "sign") state = toggleSign(state);
  else if (action === "percent") state = percent(state);

  render();
  display.focus();
});

document.addEventListener("keydown", (e) => {
  const k = e.key;

  if (k >= "0" && k <= "9") state = inputDigit(state, k);
  else if (k === ".") state = inputDot(state);
  else if (k === "+" || k === "-" || k === "*" || k === "/") state = chooseOp(state, k);
  else if (k === "Enter" || k === "=") {
    e.preventDefault();
    state = equals(state);
  }
  else if (k === "Backspace") state = backspace(state);
  else if (k === "Escape") state = clearAll();

  render();
});

display.addEventListener("input", () => {
  state = {
    ...state,
    current: normalizeNumberString(display.value.replace(/[^\d.-]/g, "")),
  };
  render();
});

render();