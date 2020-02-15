import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from './index';
import { PlayerCard } from '../utils';
import { NEW_TRACK } from './constants';

interface Chart {
  2: string[];
  3: string[];
  4: string[];
  5: string[];
  6: string[];
  7: string[];
  8: string[];
  9: string[];
  10: string[];
  A: string[];
}

export const optimalPlayChart: Chart = {
  2: [
    'stay',
    'stay',
    'stay',
    'stay',
    'stay',
    'hit',
    'double',
    'double',
    'hit',
    'hit',
    'stay',
    'stay',
    'hit',
    'hit',
    'hit',
    'hit',
    'hit',
  ],
  3: [
    'stay',
    'stay',
    'stay',
    'stay',
    'stay',
    'hit',
    'double',
    'double',
    'double',
    'hit',
    'stay',
    'double',
    'double',
    'hit',
    'hit',
    'hit',
    'hit',
  ],
  4: [
    'stay',
    'stay',
    'stay',
    'stay',
    'stay',
    'stay',
    'double',
    'double',
    'double',
    'hit',
    'stay',
    'double',
    'double',
    'double',
    'double',
    'hit',
    'hit',
  ],
  5: [
    'stay',
    'stay',
    'stay',
    'stay',
    'stay',
    'stay',
    'double',
    'double',
    'double',
    'hit',
    'stay',
    'double',
    'double',
    'double',
    'double',
    'double',
    'double',
  ],
  6: [
    'stay',
    'stay',
    'stay',
    'stay',
    'stay',
    'stay',
    'double',
    'double',
    'double',
    'hit',
    'stay',
    'double',
    'double',
    'double',
    'double',
    'double',
    'double',
  ],
  7: [
    'stay',
    'hit',
    'hit',
    'hit',
    'hit',
    'hit',
    'double',
    'double',
    'hit',
    'hit',
    'stay',
    'stay',
    'hit',
    'hit',
    'hit',
    'hit',
    'hit',
  ],
  8: [
    'stay',
    'hit',
    'hit',
    'hit',
    'hit',
    'hit',
    'double',
    'double',
    'hit',
    'hit',
    'stay',
    'stay',
    'hit',
    'hit',
    'hit',
    'hit',
    'hit',
  ],
  9: [
    'stay',
    'hit',
    'hit',
    'hit',
    'hit',
    'hit',
    'double',
    'double',
    'hit',
    'hit',
    'stay',
    'hit',
    'hit',
    'hit',
    'hit',
    'hit',
    'hit',
  ],
  10: [
    'stay',
    'hit',
    'hit',
    'hit',
    'hit',
    'hit',
    'double',
    'hit',
    'hit',
    'hit',
    'stay',
    'hit',
    'hit',
    'hit',
    'hit',
    'hit',
    'hit',
  ],
  A: [
    'stay',
    'hit',
    'hit',
    'hit',
    'hit',
    'hit',
    'hit',
    'hit',
    'hit',
    'hit',
    'stay',
    'hit',
    'hit',
    'hit',
    'hit',
    'hit',
    'hit',
  ],
};

export const trackOptimalPlay = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action
> => {
  return (dispatch, getState) => {
    // 1) find dealer up card
    // @ts-ignore
    const dealerUpCard: PlayerCard = getState().hands.dealerHand.find(
      (card: PlayerCard) => card.faceUp === true
    );
    let dealerCardVal: string = dealerUpCard.value.slice(1);
    // need to convert non-ace royals to 10
    const trueRoyals: string[] = ['J', 'Q', 'K'];
    if (trueRoyals.indexOf(dealerCardVal) > -1) {
      dealerCardVal = '10';
    }

    // 2) get playercards
    // @ts-ignore
    const playerCards: PlayerCard[] = getState().hands.playerHand;
    const playerCardValues: string[] = playerCards.map((card: PlayerCard) => {
      if (trueRoyals.indexOf(card.value) > -1) {
        card.value = '10';
      }
      return card.value;
    });
    if (
      playerCardValues.length === 2 &&
      playerCardValues[0].slice(1) === playerCardValues[1].slice(1)
    ) {
      let cardVal = playerCardValues[0].slice(1);
      if (cardVal === '0') cardVal = '10';
      const mapCardToIdx = {
        A: 17,
        8: 17,
        10: 18,
        9: 19,
        7: 20,
        6: 21,
        5: 22,
        4: 23,
        3: 24,
        2: 25,
      };
    }

    // this will be a problem if dealt two aces...
    // will probably want to return out to another function
    else if (
      playerCardValues.length === 2 &&
      playerCardValues.indexOf('A') > -1
    ) {
      const aceIndex: number = playerCardValues.indexOf('A');
      let otherIndex: number;
      aceIndex ? (otherIndex = 0) : (otherIndex = 1);
      const otherCard: string = playerCardValues[otherIndex]; // ie '7' or '10'
      const mapCardToIndex = {
        10: 10,
        9: 10,
        8: 10,
        7: 11,
        6: 12,
        5: 13,
        4: 14,
        3: 15,
        2: 16,
      };
      // @ts-ignore
      const chartIndexToCheck: string = mapCardToIndex[otherCard];
      // recall that dealerCardVal is the column you want
      // @ts-ignore
      const optimalPlay = optimalPlayChart[dealerCardVal][chartIndexToCheck];
      // change to an actual thing
      const tracker = {
        play: optimalPlay,
        yourHand: `A, ${playerCardValues[otherIndex]}`,
        dealerUpCard: dealerCardVal,
      };
      dispatch(newPlayToTrack(tracker));
    } else {
      let playerHandVal: number = getState().score.playerScore;
      let playerHandValString: string;
      if (playerHandVal > 16) playerHandValString = '17';
      else if (playerHandVal < 9) playerHandValString = '8';
      else {
        playerHandValString = playerHandVal.toString();
      }
      const mapCardToIndex = {
        17: 0,
        16: 1,
        15: 2,
        14: 3,
        13: 4,
        12: 5,
        11: 6,
        10: 7,
        9: 8,
        8: 9,
      };
      // @ts-ignore
      const chartIndexToCheck = mapCardToIndex[playerHandValString];
      //@ts-ignore
      const optimalPlay = optimalPlayChart[dealerCardVal][chartIndexToCheck];
      const tracker = {
        play: optimalPlay,
        yourHand: playerHandValString,
        dealerUpCard: dealerCardVal,
      };
      dispatch(newPlayToTrack(tracker));
    }
  };
};

// find dealer up card
// get your cards
// ignore splitting for now

// if you have ONLY two cards and an ace
// check your other card and find the spot on the cart
// othercard idx
// 8-10 10
// 7 11
// 6 12
// 5 13
// 4 14
// 3 15
// 2 16

// if you do not have an ace or have more than two cards
// check your value and find spot on chart
// val idx
// 17+ 0
// 16 1
// 15 2
// 14 3
// 13 4
// 12 5
// 11 6
// 10 7
// 9 8
// 9< 9

// I'd like to track what should have happened and what situations were
// so for each turn something like
// so I want an array of those
const turnObjExample = {
  play: 'hit',
  yourHand: '17+' || 'A, 7',
  dealerUpCard: '5',
};

export interface TrackerObject {
  play: string;
  yourHand: string;
  dealerUpCard: string;
}

const initialState: TrackerObject[] = [];

// action creator
interface TrackerAction {
  type: symbol;
  tracker: TrackerObject;
}

const newPlayToTrack = (tracker: TrackerObject) => {
  return {
    type: NEW_TRACK,
    tracker,
  };
};

// THURSDAY AFTERNOON:
// MAKE THUNK GET THE RIGHT DATA AND SEND IT TO THE ACTION CREATOR
// THEN FIND A PLACE TO STORE THE DATA FROM THE STORE
// LIKE A THIRD TAB

const trackerReducer = (state = initialState, action: TrackerAction) => {
  switch (action.type) {
    case NEW_TRACK:
      return [...state, action.tracker];
    default:
      return state;
  }
};

export default trackerReducer;
