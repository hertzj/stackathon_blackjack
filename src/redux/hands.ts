import {
  SET_PLAYER_HAND,
  SET_DEALER_HAND,
  HIT_PLAYER,
  HIT_DEALER,
} from './constants';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from './index';
import { doubleDownAction, getValue } from './score';

interface HandsAction {
  type: symbol;
  playerHand?: PlayerCard[];
  dealerHand?: PlayerCard[];
  card?: PlayerCard;
}

export interface PlayerCard {
  value: string;
  faceUp: boolean;
}

export const setPlayerHand = (playerHand: PlayerCard[]): HandsAction => {
  return {
    type: SET_PLAYER_HAND,
    playerHand,
  };
};

export const setDealerHand = (dealerHand: PlayerCard[]): HandsAction => {
  return {
    type: SET_DEALER_HAND,
    dealerHand,
  };
};

export const hitPlayer = (card: PlayerCard): HandsAction => {
  return {
    type: HIT_PLAYER,
    card,
  };
};

export const hitDealer = (card: PlayerCard): HandsAction => {
  return {
    type: HIT_DEALER,
    card,
  };
};

export const flipCard = (): ThunkAction<void, RootState, unknown, Action> => {
  return (dispatch, getState) => {
    // @ts-ignore
    const dealerCards = getState().hands.dealerHand;
    dealerCards.forEach((card: PlayerCard) => {
      let { faceUp } = card;
      if (!faceUp) card.faceUp = true;
    });
    dispatch(setDealerHand(dealerCards));
  };
};

export const flipPlayerCard = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action
> => {
  return (dispatch, getState) => {
    // @ts-ignore
    const playerCards = getState().hands.playerHand;
    let flipped = false;
    playerCards.forEach((card: PlayerCard) => {
      let { faceUp } = card;
      if (!faceUp) {
        card.faceUp = true;
        flipped = true;
      }
    });
    if (!flipped) return null;
    dispatch(setPlayerHand(playerCards));
    dispatch(doubleDownAction(false));
    dispatch(getValue(getState().player));
  };
};

const initialState = {
  playerHand: [],
  dealerHand: [],
  playerSplitHand: [],
};

const handsReducer = (state = initialState, action: HandsAction) => {
  switch (action.type) {
    case SET_PLAYER_HAND: {
      return {
        ...state,
        playerHand: action.playerHand,
      };
    }
    case SET_DEALER_HAND: {
      return {
        ...state,
        dealerHand: action.dealerHand,
      };
    }
    case HIT_PLAYER: {
      return {
        ...state,
        playerHand: [...state.playerHand, action.card],
      };
    }
    case HIT_DEALER: {
      return {
        ...state,
        dealerHand: [...state.dealerHand, action.card],
      };
    }
    default:
      return state;
  }
};

export default handsReducer;
