import {
  SET_PLAYER_HAND,
  SET_DEALER_HAND,
  HIT_PLAYER,
  HIT_DEALER,
} from './constants';

interface HandsAction {
  type: symbol;
  playerHand?: PlayerCard[];
  dealerHand?: PlayerCard[];
  card?: PlayerCard;
}

interface PlayerCard {
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
