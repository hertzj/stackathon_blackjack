import React from 'react';
import { IonRow, IonGrid, IonCol, IonItem } from '@ionic/react';
import Card from '../PlayingCard/Card';
import { useSelector } from 'react-redux';

interface PlayerCard {
  value: string;
  faceUp: boolean;
}

interface MyState {
  cards: PlayerCard[];
  name: string;
  value: number;
}

const DealerHand: React.FC = () => {
  // @ts-ignore
  const dealerHand = useSelector(state => state.hands.dealerHand);
  // @ts-ignore
  const dealerBust = useSelector(state => state.score.dealerBust);
  if (!dealerHand.length) {
    return null;
  }
  return (
    <>
      {dealerBust ? (
        <h5
          style={{
            color: 'dodgerBlue',
            textAlign: 'center',
          }}
        >
          hooray, the dealer busted!
        </h5>
      ) : null}
      <h5>Dealer hand:</h5>
      <IonGrid fixed>
        <IonRow>
          {dealerHand.map((card: PlayerCard, idx: number) => {
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
      </IonGrid>
    </>
  );
};

export default DealerHand;
