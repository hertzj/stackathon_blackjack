import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
} from '@ionic/react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPlayer } from '../redux/player';
import { initialDeal } from '../redux/deck';

const Home: React.FC = () => {
  const [name, setName] = useState('');
  //@ts-ignore
  const deck = useSelector(state => state.deck);
  const dispatch = useDispatch();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ionic Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <input type="text" onChange={ev => setName(ev.target.value)} />
        <button onClick={() => dispatch(setPlayer(name))}>
          Set your name!
        </button>
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => dispatch(initialDeal(name))}>
            Deal me!
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;
