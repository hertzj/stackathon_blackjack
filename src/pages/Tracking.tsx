import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonListHeader,
} from '@ionic/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { TrackerObject } from '../redux/tracker';

const Tracking: React.FC = () => {
  // @ts-ignore
  const current: TrackerObject[] = useSelector(state => state.tracker.current);
  // @ts-ignore
  let prior = useSelector(state => state.tracker.prior); // array of currents so to speak
  prior.reverse();
  const numPriorGames = prior.length;
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Playing History</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonListHeader>Current Game</IonListHeader>
          {current.map((trackingObj: TrackerObject, idx: number) => {
            let hand;
            if (
              trackingObj.yourHand.indexOf('A') > -1 ||
              trackingObj.yourHand.indexOf(',') > -1
            ) {
              hand = trackingObj.yourHand;
            } else {
              hand = Number(trackingObj.yourHand);
            }

            // let hand =
            //   trackingObj.yourHand.indexOf('A') > -1
            //     ? trackingObj.yourHand
            //     : Number(trackingObj.yourHand);
            let over16 = false;
            let hasAce = true;
            let sameValues = true;
            if (typeof hand === 'number') {
              hasAce = false;
              sameValues = false;
              if (hand > 16) {
                over16 = true;
              }
            }
            let splitHand = trackingObj.split;
            return (
              <IonItem key={idx}>
                You had {hasAce || sameValues ? `${hand} ` : ''}
                {!hasAce && !over16 ? `${hand} ` : ''}
                {!hasAce && over16 ? `${hand} or greater ` : ''}
                in your {splitHand ? 'split' : ''} hand and the dealer was
                showing a {trackingObj.dealerUpCard}. The correct move was to{' '}
                {trackingObj.play}. You {trackingObj.move}.
              </IonItem>
            );
          })}
        </IonList>
        <IonList>
          <IonListHeader>Prior Games</IonListHeader>
          {prior.map((game: TrackerObject[], idx: number) => {
            return (
              <IonList key={idx}>
                <IonListHeader>Game {numPriorGames - idx}</IonListHeader>
                {game.map((trackingObj: TrackerObject, idx: number) => {
                  let hand =
                    trackingObj.yourHand.indexOf('A') > -1
                      ? trackingObj.yourHand
                      : Number(trackingObj.yourHand);
                  let over16 = false;
                  let hasAce = true;
                  if (typeof hand === 'number') {
                    hasAce = false;
                    if (hand > 16) {
                      over16 = true;
                    }
                  }
                  let splitHand = trackingObj.split;
                  return (
                    <IonItem key={idx}>
                      You had {hasAce ? `${hand} ` : ''}
                      {!hasAce && !over16 ? `${hand} ` : ''}
                      {!hasAce && over16 ? `${hand} or greater ` : ''}
                      in your {splitHand ? 'split' : ''} hand and the dealer was
                      showing a {trackingObj.dealerUpCard}. The correct move was
                      to {trackingObj.play}. You {trackingObj.move}.
                    </IonItem>
                  );
                })}
              </IonList>
            );
          })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tracking;
