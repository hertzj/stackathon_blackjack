import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
} from '@ionic/react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPlayer } from '../redux/player';
import { initialDeal } from '../redux/deck';
import { NamePopOver } from './NamePopOver';

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
        <NamePopOver />
        {/* <input type="text" onChange={ev => setName(ev.target.value)} />
        <IonButton onClick={() => dispatch(setPlayer(name))}>
          Set your name!
        </IonButton> */}
      </IonContent>
    </IonPage>
  );
};

export default Home;
