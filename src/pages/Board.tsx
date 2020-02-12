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
import { hitParticipant, dealerHits, initialDeal } from '../redux/deck';

const Board: React.FC = () => {
  const [stayStatus, setStay] = useState(false);
  const [dealStatus, setDeal] = useState(false);
  //@ts-ignore
  const name = useSelector(state => state.player);
  // @ts-ignore
  const result = useSelector(state => state.result);
  const dispatch = useDispatch();

  const startGame = () => {
    setDeal(true);
    dispatch(initialDeal(name));
  };
  const stay = () => {
    setStay(true);
    dispatch(dealerHits());
  };
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
        {result ? <h3>{result} won!!</h3> : ''}
        {dealStatus ? (
          ''
        ) : (
          <IonFab vertical="bottom" horizontal="center" slot="fixed">
            <IonFabButton onClick={() => startGame()}>Deal me!</IonFabButton>
          </IonFab>
        )}
        <IonFab vertical="bottom" horizontal="start" slot="fixed">
          {stayStatus === false && dealStatus ? (
            <>
              <IonFabButton onClick={() => dispatch(hitParticipant(name))}>
                Hit me!
              </IonFabButton>
              <IonFabButton onClick={() => stay()}>Stay</IonFabButton>
            </>
          ) : (
            ''
          )}
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Board;
