const LEADERBOARD = 'LEADERBOARD';
const initialState = { socket: null, leaderboard: [] };

const redux = require('redux');
const createStore = redux.createStore;

const roomReducer = (state = initialState, action) => {
  switch (action.type) {
    case LEADERBOARD:
      return { ...state, leaderboard: action.payload.leaderboard };
    case SOCKET_CONNECTION:
      return { ...state, socket: action.payload.socket };
    default:
      return state;
  }
}

const store = createStore(roomReducer);
return store;