import {
  SET_PLAYER_HAND,
  SET_DEALER_HAND,
  HIT_PLAYER,
  HIT_DEALER,
  OFFER_SPLIT,
  SPLIT,
  SPLIT_HAND,
  HIT_SPLIT_PLAYER,
  SET_SPLIT_HAND,
} from './constants';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from './index';
import { doubleDownAction, getValue, setSplitBJ } from './score';
import { Deck, Card } from '../utils';
import { trackOptimalPlay } from './tracker';
import { setResult } from './result';

interface HandsAction {
  type: symbol;
  playerHand?: PlayerCard[];
  dealerHand?: PlayerCard[];
  playerSplitHand?: PlayerCard[];
  card?: PlayerCard;
  offerSplit?: boolean;
  split?: boolean;
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

export const setSplitHand = (playerSplitHand: PlayerCard[]): HandsAction => {
  return {
    type: SET_SPLIT_HAND,
    playerSplitHand,
  };
};

export const hitPlayer = (card: PlayerCard): HandsAction => {
  return {
    type: HIT_PLAYER,
    card,
  };
};

export const hitSplit = (card: PlayerCard): HandsAction => {
  return {
    type: HIT_SPLIT_PLAYER,
    card,
  };
};

export const hitDealer = (card: PlayerCard): HandsAction => {
  return {
    type: HIT_DEALER,
    card,
  };
};

export const offerSplit = (): HandsAction => {
  return {
    type: OFFER_SPLIT,
    offerSplit: true,
  };
};

export const declineSplit = (): HandsAction => {
  return {
    type: OFFER_SPLIT,
    offerSplit: false,
  };
};

export const splitHand = (
  playerHand: PlayerCard[],
  playerSplitHand: PlayerCard[]
): HandsAction => {
  return {
    type: SPLIT,
    offerSplit: false,
    split: true,
    playerHand,
    playerSplitHand,
  };
};

// thunks

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
    //@ts-ignore
    const splitCards = getState().hands.playerSplitHand;
    if (splitCards.length) {
      splitCards.forEach((card: PlayerCard) => {
        let { faceUp } = card;
        if (!faceUp) {
          card.faceUp = true;
          flipped = true;
        }
      });
    }
    if (!flipped) return null;
    dispatch(setPlayerHand(playerCards));
    dispatch(doubleDownAction(false));
    if (splitCards.length) {
      dispatch(setSplitHand(splitCards));
      dispatch(getValue(SPLIT_HAND));
    }
    dispatch(getValue(getState().player));
  };
};

export const splitThunk = (): ThunkAction<void, RootState, unknown, Action> => {
  return (dispatch, getState) => {
    // @ts-ignore
    const currentHand: PlayerCard[] = getState().hands.playerHand;
    const deck: Deck = getState().deck;
    const playerHand = [currentHand[0]];
    const playerSplitHand = [currentHand[1]];
    const name = getState().player;

    for (let i = 0; i < 2; i++) {
      // @ts-ignore
      const card: Card = deck.pop();
      const newCard: PlayerCard = {
        value: card,
        faceUp: true,
      };
      if (i === 0) {
        playerHand.push(newCard);
      } else {
        playerSplitHand.push(newCard);
      }
    }

    dispatch(splitHand(playerHand, playerSplitHand));
    dispatch(getValue('player')); // think this will return the default case
    dispatch(getValue(SPLIT_HAND));
    const normalVal = getState().score.playerScore;
    const splitVal = getState().score.playerSplitScore;
    if (normalVal === 21 && splitVal === 21) {
      return dispatch(setResult(`${name} with double BlackJack`));
    }
    if (normalVal === 21) {
      return dispatch(setResult(name));
    }
    if (splitVal === 21) {
      dispatch(setSplitBJ());
    }
  };
};

const initialState = {
  playerHand: [],
  dealerHand: [],
  playerSplitHand: [],
  offerSplit: false,
  split: false,
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
    case SET_SPLIT_HAND: {
      return {
        ...state,
        playerSplitHand: action.playerSplitHand,
      };
    }
    case HIT_PLAYER: {
      return {
        ...state,
        playerHand: [...state.playerHand, action.card],
      };
    }
    case HIT_SPLIT_PLAYER: {
      return {
        ...state,
        playerSplitHand: [...state.playerSplitHand, action.card],
      };
    }
    case HIT_DEALER: {
      return {
        ...state,
        dealerHand: [...state.dealerHand, action.card],
      };
    }
    case OFFER_SPLIT: {
      return {
        ...state,
        offerSplit: action.offerSplit,
      };
    }
    case SPLIT: {
      return {
        ...state,
        offerSplit: action.offerSplit,
        split: action.split,
        playerHand: action.playerHand,
        playerSplitHand: action.playerSplitHand,
      };
    }
    default:
      return state;
  }
};

export default handsReducer;
