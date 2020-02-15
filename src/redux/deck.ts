import { INITIAL_DEAL, DEAL_CARD, SPLIT_HAND } from './constants';
import {
  setPlayerHand,
  setDealerHand,
  hitDealer,
  hitPlayer,
  flipCard,
  offerSplit,
  hitSplit,
} from './hands';
import { shuffle, fullDeck, PlayerCard, checkPair } from '../utils';
import { getValue, doubleDownAction } from './score';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from './index';
import { findWinner, setResult } from './result';
import { trackOptimalPlay } from './tracker';

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
  return (dispatch, getState) => {
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
    // for SPLIT CHECK
    playerCards.pop();
    playerCards.pop();
    playerCards.push({
      value: 'HA',
      faceUp: true,
    });
    playerCards.push({
      value: 'CK',
      faceUp: true,
    });
    if (checkPair(playerCards)) {
      // NOT PART OF SPLIT CHECK; LEAVE IN
      dispatch(offerSplit());
    }
    // END SPLIT CHECK
    dispatch(setPlayerHand(playerCards));
    dispatch(setDealerHand(dealerCards));
    dispatch(initialDealActionCreator(shuffledDeck));
    dispatch(getValue('dealer'));
    dispatch(getValue(playerName));
    // dispatch(trackOptimalPlay(playerName));
    if (getState().score.playerScore === 21) {
      return dispatch(setResult(playerName));
    }
  };
};

export const doubleDownThunk = (
  activeHand: string
): ThunkAction<void, RootState, unknown, Action> => {
  return (dispatch, getState) => {
    const deck: Deck = getState().deck;
    //@ts-ignore
    const card: Card = deck.pop();
    const newCard: PlayerCard = {
      value: card,
      faceUp: false,
    };
    dispatch(doubleDownAction(true));
    dispatch(dealCardActionCreator(deck));

    if (activeHand === SPLIT_HAND) {
      dispatch(hitSplit(newCard));
      dispatch(getValue(SPLIT_HAND));
    } else {
      dispatch(hitPlayer(newCard));
      dispatch(getValue(getState().player));
    }
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
  } else if (participant === SPLIT_HAND) {
    return (dispatch, getState) => {
      const deck: Deck = getState().deck;
      // @ts-ignore
      const card: Card = deck.pop();
      const newCard: PlayerCard = {
        value: card,
        faceUp: true,
      };
      dispatch(hitSplit(newCard));
      dispatch(dealCardActionCreator(deck));
      dispatch(getValue(SPLIT_HAND));
      // need to have tracking account for split
      // dispatch(trackOptimalPlay(SPLIT_HAND));
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
      // dispatch(trackOptimalPlay(getState().player));
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
      if (getState().score.dealerScore === 17 && dealer17 === false) {
        return dispatch(findWinner());
      }
      dispatch(hitParticipant('dealer'));
    }
    dispatch(findWinner());
  };
};

// should this type just be Deck?
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
