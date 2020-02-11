import { combineReducers } from 'redux';
import deckReducer from './deck';
import handsReducer from './hands';
import playerReducer from './player';
import scoreReducer from './score';

const appReducer = combineReducers({
  deck: deckReducer,
  hands: handsReducer,
  player: playerReducer,
  score: scoreReducer,
  // tracker: trackerReducer,
});

export default appReducer;
export type RootState = ReturnType<typeof appReducer>;
