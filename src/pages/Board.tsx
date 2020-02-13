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
import {
  hitParticipant,
  dealerHits,
  initialDeal,
  doubleDownThunk,
} from '../redux/deck';
import { resetStore } from '../store';

const Board: React.FC = () => {
  const [stayStatus, setStay] = useState(false);
  const [dealStatus, setDeal] = useState(false);
  const [doubleDownStatus, setDouble] = useState(false);
  //@ts-ignore
  const name = useSelector(state => state.player);
  // @ts-ignore
  const result = useSelector(state => state.result);
  const dispatch = useDispatch();

  const startGame = () => {
    setDeal(true);
    setDouble(true);
    dispatch(initialDeal(name));
  };
  const stay = () => {
    setStay(true);
    dispatch(dealerHits());
  };

  const hit = () => {
    dispatch(hitParticipant(name));
    setDouble(false);
  };

  const doubleDown = () => {
    dispatch(doubleDownThunk());
    setDouble(false);
    stay();
  };

  // doubnle down plan
  // have doubledown button that only shows after initial deal
  // write double down thunk and dispatch that from doubledown button
  // for some reason, this can cause an infinite loop now
  // is is in the get value thunk

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
        {result ? (
          <>
            <h3>{result} won!!</h3>
            <IonFab vertical="bottom" horizontal="center" slot="fixed">
              <IonFabButton onClick={() => dispatch(resetStore())}>
                Start Over (DUH CHANGE THIS)!
              </IonFabButton>
            </IonFab>
          </>
        ) : (
          ''
        )}
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
              {doubleDownStatus ? (
                <IonFabButton onClick={() => doubleDown()}>
                  Double Down
                </IonFabButton>
              ) : (
                ''
              )}
              <IonFabButton onClick={() => hit()}>Hit me!</IonFabButton>
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
