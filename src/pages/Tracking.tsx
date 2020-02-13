import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
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
        <IonTitle>How Well Have You Played?</IonTitle>
      </IonHeader>
      <IonContent>
        <ul>
          {trackingArr.map((trackingObj: TrackerObject) => {
            return (
              <li>
                `You had {trackingObj.yourHand} in your hand and the dealer was
                showing a {trackingObj.dealerUpCard}. You should have{' '}
                {trackingObj.play}. You...ADD THIS. Need to call at a different
                time.`
              </li>
            );
          })}
        </ul>
      </IonContent>
    </IonPage>
  );
};

export default Tracking;
