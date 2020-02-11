import {
  RESET_SCORE,
  UPDATE_DEALER_SCORE,
  UPDATE_PLAYER_SCORE,
  UPDATE_SPLIT_SCORE,
} from './constants';
import { Royals, PlayerCard } from '../utils';
import { findWinner } from './result';

export interface ScoreState {
  playerScore: number;
  dealerScore: number;
  playerSplitScore: number;
  playerBust: boolean;
  dealerBust: boolean;
  playerSplitBust: boolean;
}

const initialState: ScoreState = {
  playerScore: 0,
  dealerScore: 0,
  playerSplitScore: 0,
  playerBust: false,
  dealerBust: false,
  playerSplitBust: false,
};

// action creator
export const updateScore = (
  playerName: string,
  score: number,
  busted: boolean
) => {
  if (playerName === 'dealer') {
    return {
      type: UPDATE_DEALER_SCORE,
      score,
      busted,
    };
  } else if (playerName === 'split') {
    return {
      type: UPDATE_SPLIT_SCORE,
      score,
      busted,
    };
  } else {
    return {
      type: UPDATE_PLAYER_SCORE,
      score,
      busted,
    };
  }
};

// thunk

export const getValue = (playerName: string) => {
  let hand: string;
  switch (playerName) {
    case 'dealer':
      hand = 'dealerHand';
      break;
    case 'split':
      hand = 'playerSplitHand';
      break;
    default:
      hand = 'playerHand';
  }
  return (dispatch: any, getState: any) => {
    const cards = getState().hands[hand];
    const mapRoyalToVal: { [key in Royals]: number } = {
      J: 10,
      Q: 10,
      K: 10,
      A: 11,
    };
    const royalKeys = Object.keys(mapRoyalToVal) as Royals[];
    let aces = 0;
    let value = cards.reduce((acc: number, card: PlayerCard) => {
      const cardVal = card.value.slice(1) as Royals;
      let num: string | number = cardVal;
      if (royalKeys.indexOf(cardVal) === 3) {
        aces++;
      }
      if (royalKeys.indexOf(cardVal) > -1) {
        num = mapRoyalToVal[cardVal];
      }
      acc += Number(num);
      return acc;
    }, 0);
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }
    if (value > 21) {
      dispatch(updateScore(playerName, value, true));
      return dispatch(findWinner());
    }
    dispatch(updateScore(playerName, value, false));
  };
};

const scoreReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case RESET_SCORE:
      return initialState;
    case UPDATE_PLAYER_SCORE: {
      return {
        ...state,
        playerScore: action.score,
        playerBust: action.busted,
      };
    }
    case UPDATE_SPLIT_SCORE: {
      return {
        ...state,
        playerSplitScore: action.score,
        playerSplitBust: action.busted,
      };
    }
    case UPDATE_DEALER_SCORE:
      return {
        ...state,
        dealerScore: action.score,
        dealerBust: action.busted,
      };
    default:
      return state;
  }
};

export default scoreReducer;
