import { INITIAL_DEAL, DEAL_CARD } from './constants';
import {
  setPlayerHand,
  setDealerHand,
  hitDealer,
  hitPlayer,
  flipCard,
} from './hands';
import { shuffle, fullDeck, PlayerCard } from '../utils';
import { getValue } from './score';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from './index';
import { findWinner } from './result';

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
    dispatch(getValue('dealer'));
    dispatch(getValue(playerName));
  };
};

export const hitParticipant = (
  participant: string
): ThunkAction<void, RootState, unknown, Action> => {
  if (participant === 'dealer') {
    return (dispatch, getState) => {
      const deck: Deck = getState().deck;
      //@ts-ignore
      const card: Card = deck.pop();
      const newCard: PlayerCard = {
        value: card,
        faceUp: true,
      };
      dispatch(hitDealer(newCard));
      dispatch(dealCardActionCreator(deck));
      dispatch(getValue('dealer'));
    };
  } else {
    // need to deal with splitting
    return (dispatch, getState) => {
      const deck: Deck = getState().deck;
      // @ts-ignore
      const card: Card = deck.pop();
      const newCard: PlayerCard = {
        value: card,
        faceUp: true,
      };
      dispatch(hitPlayer(newCard));
      dispatch(dealCardActionCreator(deck));
      dispatch(getValue(getState().player));
    };
  }
};

export const dealerHits = (): ThunkAction<void, RootState, unknown, Action> => {
  return (dispatch, getState) => {
    dispatch(flipCard());
    let dealer17 = false;
    //@ts-ignore
    getState().hands.dealerHand.forEach(card => {
      const val = card.value.slice(1);
      if (val === 'A') {
        dealer17 = true;
      }
    });
    while (getState().score.dealerScore <= 17) {
      // fix this
      // if (getState().score.dealerScore === 17 && dealer17 === false) {
      //   return dispatch(findWinner());
      // }
      dispatch(hitParticipant('dealer'));
    }
    dispatch(findWinner());
  };
};

const initialState: Deck[] = [];

const deckReducer = (state = initialState, action: DeckAction) => {
  switch (action.type) {
    case INITIAL_DEAL:
      return action.cards;
    case DEAL_CARD:
      return action.cards;
    default:
      return state;
  }
};

export default deckReducer;
