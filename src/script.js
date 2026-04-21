
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


import * as Sentry from "@sentry/vue";

Sentry.init({
  dsn: "https://9ddbf6cc51bfc72a08e88b9cbb6ee69e@o4511252662583296.ingest.de.sentry.io/4511252675035216",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  environment: "development",
});


Sentry.setUser({
  id: "12345",
  email: "student@example.com",
  segment: "premium_user",
});


const breakWorldBtn = document.getElementById("break-world-btn");

if (breakWorldBtn) {
  breakWorldBtn.addEventListener("click", () => {
    const error = new Error("Sentry Test Error: Something went wrong!");

    Sentry.addBreadcrumb({
      message: "Break the world button clicked",
      category: "user",
      level: "info",
    });

    Sentry.captureException(error);
    console.error("[Sentry Test Error]", error);
  });
}



import posthog from 'posthog-js'

posthog.init('phc_CRMXFeGk27viD8LZnPZgAZMgaMJwZtvVsPDocN8oEqFw', {
    api_host: 'https://eu.i.posthog.com',
    defaults: '2026-01-30'
})

posthog.capture("calculator_opened", {
  page: "calculator",
});
posthog.capture('calculation_started', {
  reason: 'first_input',
});
posthog.capture('calculation_cleared', {
  reason: 'reset_all',
});

posthog.onFeatureFlags(() => {
  const percentBtn = document.getElementById("percent-btn");

  if (!percentBtn) return;

  if (posthog.isFeatureEnabled("show-urgent-filter")) {
    percentBtn.style.display = "block";
  } else {
    percentBtn.style.display = "none";
  }
});

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