import { generateKeyPair } from "rsa-encryption-js";

export const START_SESSION = "app/START_SESSION";

export function startSession(name) {
  return { type: START_SESSION, payload: name };
}

export const GENERATE_KEY = "app/GENERATE_KEY";

export function makeKey() {
  const key = generateKeyPair();
  return { type: GENERATE_KEY, payload: key };
}

const initialState = {
  name: "",
  RSAkey: null
};

export function app(state = initialState, action: Action) {
  switch (action.type) {
    case START_SESSION:
      return { ...state, name: action.payload };

    case GENERATE_KEY:
      return { ...state, RSAkey: action.payload };

    default:
      return state;
  }
}
