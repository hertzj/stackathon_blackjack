export type Card = string;
export type Suit = string[];
export type Deck = Card[];

export enum Royals {
  Jack = 'J',
  Queen = 'Q',
  King = 'K',
  Ace = 'A',
}

export const hearts = 'H2 H3 H4 H5 H6 H7 H8 H9 H10 HJ HQ HK HA'.split(' ');
export const spades = 'S2 S3 S4 S5 S6 S7 S8 S9 S10 SJ SQ SK SA'.split(' ');
export const diamonds = 'D2 D3 D4 D5 D6 D7 D8 D9 D10 DJ DQ DK DA'.split(' ');
export const clubs = 'C2 C3 C4 C5 C6 C7 C8 C9 C10 CJ CQ CK CA'.split(' ');

export type CreateDeck = (
  suit1: Suit,
  suit2: Suit,
  suit3: Suit,
  suit4: Suit
) => Deck;

export const createDeck: CreateDeck = (suit1, suit2, suit3, suit4) => {
  let deck = suit1.concat(suit2);
  deck = deck.concat(suit3);
  deck = deck.concat(suit4);
  return deck;
};

export const fullDeck = createDeck(hearts, spades, diamonds, clubs);

export type Shuffle = (deck: Deck) => Deck;

export const shuffle: Shuffle = unshuffledDeck => {
  const copyOfDeck = unshuffledDeck.slice(0);
  const shuffledDeck = [];
  const numCards = copyOfDeck.length;
  for (let i = 0; i < numCards; i++) {
    let indexToPick = Math.floor(numCards * Math.random());
    if (copyOfDeck[indexToPick] === 'picked') {
      i--;
      continue;
    } else {
      shuffledDeck.push(copyOfDeck[indexToPick]);
      copyOfDeck[indexToPick] = 'picked';
    }
  }
  return shuffledDeck;
};

export interface PlayerCard {
  value: string;
  faceUp: boolean;
}

export interface MyState {
  cards: PlayerCard[];
  name: string;
  value: number;
}
