export function createInitialState() {
  return {
    current: "0",
    stored: null,
    op: null,
    justEvaluated: false,
  };
}

export function normalizeNumberString(s) {
  if (s === "" || s === "-" || s === "-0") return s;

  if (s.includes(".")) {
    const [a, b] = s.split(".");
    const na = String(Number(a));
    return `${na}.${b}`;
  }

  return String(Number(s));
}

export function formatResult(x) {
  if (!Number.isFinite(x)) return "Error";

  const rounded = Math.round((x + Number.EPSILON) * 1e12) / 1e12;
  return String(rounded);
}

export function compute(a, b, operator) {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b === 0 ? NaN : a / b;
    default:
      return b;
  }
}

export function inputDigit(state, digit) {
  if (state.justEvaluated) {
    return {
      ...state,
      current: digit,
      justEvaluated: false,
    };
  }

  if (state.current === "0") {
    return {
      ...state,
      current: digit,
    };
  }

  if (state.current === "-0") {
    return {
      ...state,
      current: "-" + digit,
    };
  }

  return {
    ...state,
    current: state.current + digit,
  };
}

export function inputDot(state) {
  if (state.justEvaluated) {
    return {
      ...state,
      current: "0.",
      justEvaluated: false,
    };
  }

  if (!state.current.includes(".")) {
    return {
      ...state,
      current: state.current + ".",
    };
  }

  return state;
}

export function clearAll() {
  return createInitialState();
}

export function backspace(state) {
  if (state.justEvaluated) {
    return createInitialState();
  }

  if (
    state.current.length <= 1 ||
    (state.current.length === 2 && state.current.startsWith("-"))
  ) {
    return {
      ...state,
      current: "0",
    };
  }

  return {
    ...state,
    current: state.current.slice(0, -1),
  };
}

export function toggleSign(state) {
  if (state.current === "0") return state;

  if (state.current.startsWith("-")) {
    return {
      ...state,
      current: state.current.slice(1),
    };
  }

  return {
    ...state,
    current: "-" + state.current,
  };
}

export function percent(state) {
  const n = Number(state.current);
  if (!Number.isFinite(n)) return state;

  return {
    ...state,
    current: String(n / 100),
  };
}

export function chooseOp(state, nextOp) {
  const currNum = Number(state.current);
  if (!Number.isFinite(currNum)) return state;

  if (state.stored === null) {
    return {
      ...state,
      stored: currNum,
      op: nextOp,
      justEvaluated: true,
    };
  }

  if (state.op && !state.justEvaluated) {
    const res = compute(state.stored, currNum, state.op);

    return {
      ...state,
      current: formatResult(res),
      stored: res,
      op: nextOp,
      justEvaluated: true,
    };
  }

  return {
    ...state,
    op: nextOp,
    justEvaluated: true,
  };
}

export function equals(state) {
  if (state.op === null || state.stored === null) return state;

  const a = state.stored;
  const b = Number(state.current);

  if (!Number.isFinite(b)) return state;

  const res = compute(a, b, state.op);

  return {
    ...state,
    current: formatResult(res),
    stored: res,
    op: null,
    justEvaluated: true,
  };
}

export function calculateAndFormat(a, b, operator, formatter) {
  const result = compute(a, b, operator);
  return formatter(result);
}