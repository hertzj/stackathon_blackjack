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
import Hand from './Hand';
import DealerHand from './DealerHand';
import { hitParticipant, dealerHits } from '../redux/deck';

const Board: React.FC = () => {
  //@ts-ignore
  const name = useSelector(state => state.player);
  // @ts-ignore
  const result = useSelector(state => state.result);
  const dispatch = useDispatch();
  // if (result) {
  //   return (
  //     <IonPage>
  //       <IonContent>{result} won!!!!</IonContent>
  //     </IonPage>
  //   );
  // }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>BlackJack!!</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <DealerHand />
        <Hand name={name} />
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => dispatch(hitParticipant(name))}>
            Hit me!
          </IonFabButton>
          <IonFabButton onClick={() => dispatch(dealerHits())}>
            Stay
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Board;
