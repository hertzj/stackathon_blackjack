import React from 'react';
import { IonRow, IonGrid, IonCol, IonItem } from '@ionic/react';
import Card from '../PlayingCard/Card';
import { useSelector } from 'react-redux';
import { SPLIT_HAND } from '../redux/constants';

interface PlayerCard {
  value: string;
  faceUp: boolean;
}

interface MyState {
  cards: PlayerCard[];
  name: string;
  value: number;
}

const Hand: React.FC = props => {
  // @ts-ignore
  const name: string = props.name;

  // @ts-ignore
  const playerHand = useSelector(state => state.hands.playerHand);
  // @ts-ignore
  const playerBust = useSelector(state => state.score.playerBust);

  // @ts-ignore
  const splitCards = useSelector(state => state.hands.playerSplitHand);
  //@ts-ignore
  const splitBust = useSelector(state => state.score.playerSplitBust);

  const split: boolean = name === SPLIT_HAND ? true : false;

  const normalHand = () => {
    return (
      <>
        <h5>{`${name}'s hand:`}</h5>
        <IonRow>
          {playerHand.map((card: PlayerCard, idx: number) => {
            const { value, faceUp } = card;
            if (faceUp === false) {
              return (
                <IonItem key={idx} color="primary">
                  <IonCol color="primary" sizeSm="2" key={idx}>
                    <Card rank={null} suit={null} />
                  </IonCol>
                </IonItem>
              );
            }
            const suit = value.slice(0, 1);
            const cardVal = value.slice(1);
            return (
              <IonItem key={idx} color="primary">
                <IonCol color="primary" sizeSm="2" key={idx}>
                  <Card rank={cardVal} suit={suit} />
                </IonCol>
              </IonItem>
            );
          })}
        </IonRow>
      </>
    );
  };

  const splitHand = () => {
    return (
      <>
        <h5>Split hand:</h5>
        <IonRow>
          {splitCards.map((card: PlayerCard, idx: number) => {
            const { value, faceUp } = card;
            if (faceUp === false) {
              return (
                <IonItem color="primary" key={idx}>
                  <IonCol sizeSm="2" key={idx}>
                    <Card rank={null} suit={null} />
                  </IonCol>
                </IonItem>
              );
            }
            const suit = value.slice(0, 1);
            const cardVal = value.slice(1);
            return (
              <IonItem color="primary" key={idx}>
                <IonCol sizeSm="2" key={idx}>
                  <Card rank={cardVal} suit={suit} />
                </IonCol>
              </IonItem>
            );
          })}
        </IonRow>
      </>
    );
  };

  if (!playerHand.length) {
    return null;
  }
  return (
    <>
      {playerBust && split === false ? (
        <h5
          style={{
            textAlign: 'center',
            color: 'tomato',
          }}
        >
          {name} busted
        </h5>
      ) : null}
      {splitBust && split === true ? (
        <h5
          style={{
            textAlign: 'center',
            color: 'tomato',
          }}
        >
          split hand busted
        </h5>
      ) : null}
      <IonGrid fixed>{split ? splitHand() : normalHand()}</IonGrid>
    </>
  );
};

export default Hand;
