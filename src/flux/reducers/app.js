export const START_SESSION = 'app/START_SESSION'

export function startSession(username) {
  return {type: START_SESSION, payload: username}
}

const initialState = {
	username: '',
  RSAkey: null,
}

export function app(state = initialState, action: Action) {
	switch (action.type) {
		case START_SESSION:
			return {...state, username: action.payload}

		default:
			return state
	}
}
