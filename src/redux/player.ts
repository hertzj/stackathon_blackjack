import { SET_PLAYER_NAME } from './constants';

const initialState = '';

interface NameAction {
  type: symbol;
  name: string;
}

export const setPlayer = (name: string): NameAction => {
  return {
    type: SET_PLAYER_NAME,
    name,
  };
};

const playerReducer = (state = initialState, action: NameAction) => {
  switch (action.type) {
    case SET_PLAYER_NAME: {
      return action.name;
    }
    default:
      return state;
  }
};

export default playerReducer;
