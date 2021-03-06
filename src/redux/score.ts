import {
  RESET_SCORE,
  UPDATE_DEALER_SCORE,
  UPDATE_PLAYER_SCORE,
  UPDATE_SPLIT_SCORE,
  DOUBLE_DOWN,
  SPLIT_HAND,
  SPLIT_BLACK_JACK,
  NEW_GAME,
} from './constants';
import { Royals, PlayerCard } from '../utils';
import { findWinner, setResult } from './result';
import { dealerHits } from './deck';

export interface ScoreState {
  playerScore: number;
  dealerScore: number;
  playerSplitScore: number;
  playerBust: boolean;
  dealerBust: boolean;
  playerSplitBust: boolean;
  flippedCard: boolean;
  splitBlackJack: boolean;
}

const initialState: ScoreState = {
  playerScore: 0,
  dealerScore: 0,
  playerSplitScore: 0,
  playerBust: false,
  dealerBust: false,
  playerSplitBust: false,
  flippedCard: false,
  splitBlackJack: false,
};

// action creators
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
  } else if (playerName === SPLIT_HAND) {
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

export const doubleDownAction = (flippedCard: boolean) => {
  return {
    type: DOUBLE_DOWN,
    flippedCard,
  };
};

export const setSplitBJ = () => {
  return {
    type: SPLIT_BLACK_JACK,
    splitBlackJack: true,
  };
};

// thunk

export const getValue = (playerName: string) => {
  let hand: string;
  switch (playerName) {
    case 'dealer':
      hand = 'dealerHand';
      break;
    case SPLIT_HAND:
      hand = 'playerSplitHand';
      break;
    default:
      hand = 'playerHand';
  }
  return (dispatch: any, getState: any) => {
    const isSplit = getState().hands.split;
    const cards = getState().hands[hand];
    const flippedCard = getState().score.flippedCard;
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
    // might need to better handle situation where flippedcard is true
    if (value > 21 && flippedCard === false) {
      dispatch(updateScore(playerName, value, true));
      if (getState().score.splitBlackJack) {
        return dispatch(setResult(playerName));
      }
      if (hand === 'playerHand' && !isSplit) {
        return dispatch(findWinner());
      }
    } else if (value > 21 && playerName === 'dealer') {
      dispatch(updateScore(playerName, value, true));
      dispatch(findWinner());
    } else {
      dispatch(updateScore(playerName, value, false));
    }
  };
};

const scoreReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case RESET_SCORE:
      return initialState;
    case UPDATE_PLAYER_SCORE:
      return {
        ...state,
        playerScore: action.score,
        playerBust: action.busted,
      };
    case UPDATE_SPLIT_SCORE:
      return {
        ...state,
        playerSplitScore: action.score,
        playerSplitBust: action.busted,
      };
    case UPDATE_DEALER_SCORE:
      return {
        ...state,
        dealerScore: action.score,
        dealerBust: action.busted,
      };
    case DOUBLE_DOWN:
      return {
        ...state,
        flippedCard: action.flippedCard,
      };
    case SPLIT_BLACK_JACK:
      return {
        ...state,
        splitBlackJack: action.splitBlackJack,
      };
    case NEW_GAME:
      return initialState;
    default:
      return state;
  }
};

export default scoreReducer;
