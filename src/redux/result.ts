import { SET_WINNER } from './constants';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from './index';
import { PlayerCard } from '../utils';
import { setPlayerHand, flipPlayerCard } from './hands';
import { doubleDownAction, getValue } from './score';

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
    const dealerBust = getState().score.dealerBust;
    if (playerBust) {
      return dispatch(setResult('dealer'));
    }
    if (dealerBust) {
      return dispatch(setResult(playerName));
    }
    const playerScore = getState().score.playerScore;
    const dealerScore = getState().score.dealerScore;
    if (playerScore > dealerScore) {
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
    default:
      return state;
  }
};

export default resultReducer;
