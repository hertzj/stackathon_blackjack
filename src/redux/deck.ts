import { INITIAL_DEAL, DEAL_CARD } from './constants';
import { setPlayerHand, setDealerHand, hitDealer, hitPlayer } from './hands';
import { shuffle, fullDeck } from '../utils';
// import { getValue } from './score';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from './index';

export type Card = string;
export type Deck = Card[];

interface DeckAction {
  type: symbol;
  cards: Deck;
}

// action creators

export const initialDealActionCreator = (cards: Deck): DeckAction => {
  return {
    type: INITIAL_DEAL,
    cards,
  };
};

export const dealCardActionCreator = (cards: Deck): DeckAction => {
  return {
    type: DEAL_CARD,
    cards,
  };
};

// thunks

export const initialDeal = (
  playerName: string
): ThunkAction<void, RootState, unknown, Action> => {
  return dispatch => {
    const shuffledDeck = shuffle(fullDeck);
    const playerCards = [];
    const dealerCards = [];
    for (let i = 0; i < 4; i++) {
      const card = shuffledDeck.pop();
      const handCard = {
        value: '',
        faceUp: true,
      };
      handCard.faceUp = true;
      if (i % 2 === 0 && card !== undefined) {
        handCard.value = card;
        playerCards.push(handCard);
      }
      if (i === 3 && card !== undefined) {
        handCard.value = card;
        dealerCards.push(handCard);
        if (card.indexOf('A') > -1) {
          console.log('need to add insurance function and show this card');
          console.log('also need to check for 21');
        }
      } else if (i === 1 && card !== undefined) {
        handCard.value = card;
        handCard.faceUp = false;
        dealerCards.push(handCard);
      }
    }
    dispatch(setPlayerHand(playerCards));
    dispatch(setDealerHand(dealerCards));
    dispatch(initialDealActionCreator(shuffledDeck));
    // dispatch(getValue('dealer'));
    // dispatch(getValue(playerName));
  };
};

export const hitParticipant = (participant: string) => {
  if (participant === 'dealer') {
    return (dispatch: any, getState: any) => {
      const deck = getState().deck;
      const card = deck.pop();
      const newCard = {
        value: card,
        faceUp: true,
      };
      dispatch(hitDealer(newCard));
      dispatch(dealCardActionCreator(deck));
    };
  } else {
    // need to deal with splitting
    return (dispatch: any, getState: any) => {
      const deck = getState().deck;
      const card = deck.pop();
      const newCard = {
        value: card,
        faceUp: true,
      };
      dispatch(hitPlayer(newCard));
      dispatch(dealCardActionCreator(deck));
    };
  }
};

const initialState: Deck[] = [];

const deckReducer = (state = initialState, action: DeckAction) => {
  switch (action.type) {
    case INITIAL_DEAL:
      return action.cards;
    case DEAL_CARD:
      return action.cards;
    default:
      return initialState;
  }
};

export default deckReducer;
