import { combineReducers } from 'redux';
import deckReducer from './deck';
import handsReducer from './hands';
import playerReducer from './player';
import scoreReducer from './score';
import resultReducer from './result';
import trackerReducer from './tracker';
import { NEW_GAME } from './constants';

export const newGame = () => {
  return {
    type: NEW_GAME,
  };
};

const appReducer = combineReducers({
  deck: deckReducer,
  hands: handsReducer,
  player: playerReducer,
  score: scoreReducer,
  result: resultReducer,
  tracker: trackerReducer,
});

export default appReducer;
export type RootState = ReturnType<typeof appReducer>;
