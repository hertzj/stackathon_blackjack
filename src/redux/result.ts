import { SET_WINNER, NEW_GAME } from './constants';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from './index';
import { flipPlayerCard } from './hands';

interface ResultAction {
  type: symbol;
  winner: string;
}

export const setResult = (name: string) => {
  if (name === 'dealer')
    return {
      type: SET_WINNER,
      winner: 'dealer',
    };
  else {
    return {
      type: SET_WINNER,
      winner: name,
    };
  }
};

export const findWinner = (): ThunkAction<void, RootState, unknown, Action> => {
  return (dispatch, getState) => {
    dispatch(flipPlayerCard());
    const playerName = getState().player;
    const playerBust = getState().score.playerBust;
    const playerSplitBust = getState().score.playerSplitBust;
    const dealerBust = getState().score.dealerBust;
    //@ts-ignore
    const isSplit = getState().hands.split;

    if (playerBust && isSplit === false) {
      return dispatch(setResult('dealer'));
    }
    if (playerBust && playerSplitBust) {
      return dispatch(setResult('dealer'));
    }
    if (dealerBust) {
      return dispatch(setResult(playerName));
    }
    const playerScore = getState().score.playerScore;
    const dealerScore = getState().score.dealerScore;
    const splitScore = getState().score.playerSplitScore;
    if (playerScore > dealerScore) {
      dispatch(setResult(playerName));
    } else if (splitScore > dealerScore) {
      dispatch(setResult(playerName));
    } else {
      dispatch(setResult('dealer'));
    }
  };
};

const initialState = '';

const resultReducer = (state = initialState, action: ResultAction) => {
  switch (action.type) {
    case SET_WINNER: {
      return action.winner;
    }
    case NEW_GAME: {
      return initialState;
    }
    default:
      return state;
  }
};

export default resultReducer;
