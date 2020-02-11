import {
  RESET_SCORE,
  HIT_PLAYER,
  HIT_DEALER,
  HIT_SPLIT_PLAYER,
} from './constants';
import { Royals, PlayerCard } from '../utils';

const initialState = {
  playerScore: 0,
  dealerScore: 0,
  playerSplitScore: 0,
};

// action creator
export const updateScore = (playerName: string, score: number) => {
  if (playerName === 'dealer') {
    return {
      type: HIT_DEALER,
      score,
    };
  } else if (playerName === 'split') {
    return {
      type: HIT_SPLIT_PLAYER,
      score,
    };
  } else {
    return {
      type: HIT_PLAYER,
      score,
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
    const value = cards.reduce((acc: number, card: PlayerCard) => {
      const cardVal = card.value.slice(1) as Royals; // a little worried about this as Royals
      let num: string | number = cardVal;
      if (acc > 21 && royalKeys.indexOf(cardVal) === 4) {
        num = '1';
      } else if (royalKeys.indexOf(cardVal) === 4 && acc + 11 > 21) {
        num = '1';
      } else if (royalKeys.indexOf(cardVal) > -1) {
        num = mapRoyalToVal[cardVal];
      }
      acc += Number(num);
      return acc;
    }, 0);
    dispatch(updateScore(playerName, value));
  };
};

const scoreReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case RESET_SCORE:
      return initialState;
    case HIT_PLAYER: {
      return {
        ...state,
        playerScore: action.score,
      };
    }
    case HIT_SPLIT_PLAYER: {
      return {
        ...state,
        playerSplitScore: action.score,
      };
    }
    case HIT_DEALER:
      return {
        ...state,
        dealerScore: action.score,
      };
    default:
      return initialState;
  }
};

export default scoreReducer;
