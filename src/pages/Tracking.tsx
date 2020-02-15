import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { TrackerObject } from '../redux/tracker';

const Tracking: React.FC = () => {
  // @ts-ignore
  const trackingArr: TrackerObject[] = useSelector(state => state.tracker);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Playing History</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <ul>
          {trackingArr.map((trackingObj: TrackerObject, idx: number) => {
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
              <li key={idx}>
                You had {hasAce ? `${hand} ` : ''}
                {!hasAce && !over16 ? `${hand} ` : ''}
                {!hasAce && over16 ? `${hand} or greater ` : ''}
                in your {splitHand ? 'split' : ''} hand and the dealer was
                showing a {trackingObj.dealerUpCard}. The correct move was to{' '}
                {trackingObj.play}. You {trackingObj.move}.
              </li>
            );
          })}
        </ul>
      </IonContent>
    </IonPage>
  );
};

export default Tracking;
