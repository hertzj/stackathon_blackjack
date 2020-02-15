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
import { splitThunk, declineSplit } from '../redux/hands';
import { SPLIT_HAND, NORMAL } from '../redux/constants';

const Board: React.FC = () => {
  const [stayStatus, setStay] = useState(false);
  const [dealStatus, setDeal] = useState(false);
  const [doubleDownStatus, setDouble] = useState(false);
  const [activeHand, setActiveHand] = useState(NORMAL);

  // and if splitting...
  const [splitStayStatus, setSplitStay] = useState(false);
  const [splitDealStatus, setSplitDeal] = useState(false);
  const [splitDoubleDownStatus, setSplitDouble] = useState(false);

  //@ts-ignore
  const name: string = useSelector(state => state.player);
  // busting
  // @ts-ignore
  const playerBust: boolean = useSelector(state => state.score.playerBust);
  //@ts-ignore
  const splitBust: boolean = useSelector(state => state.score.playerSplitBust);
  // @ts-ignore
  const result = useSelector(state => state.result);
  // @ts-ignore
  const offerSplit = useSelector(state => state.hands.offerSplit);
  // @ts-ignore
  const isSplit = useSelector(state => state.hands.split);

  const dispatch = useDispatch();

  // might be the place for useEffect replacing componentDidUpdate
  if (splitBust && activeHand === SPLIT_HAND) {
    setActiveHand(NORMAL);
  }

  const startGame = () => {
    setDeal(true);
    setDouble(true);
    dispatch(initialDeal(name));
  };
  const stay = () => {
    if (isSplit && activeHand === NORMAL) {
      setStay(true);
      dispatch(dealerHits());
    } else if (isSplit && activeHand === SPLIT_HAND) {
      setSplitStay(true);
      setActiveHand(NORMAL);
      return;
    } else {
      setStay(true);
      dispatch(dealerHits());
    }
  };

  const hit = () => {
    if (activeHand === NORMAL) {
      dispatch(hitParticipant(name));
      dispatch(declineSplit());
      setDouble(false);
    } else {
      dispatch(hitParticipant(SPLIT_HAND));
      setSplitDouble(false);
    }
  };

  const doubleDown = () => {
    if (activeHand === SPLIT_HAND) {
      dispatch(doubleDownThunk(SPLIT_HAND));
      setSplitDouble(false);
    } else {
      dispatch(doubleDownThunk(NORMAL));
      setDouble(false);
    }
    // stay();
  };

  const split = () => {
    dispatch(splitThunk());
    setSplitDeal(true);
    setSplitDouble(true);
    setActiveHand(SPLIT_HAND);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>BlackJack!!</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
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
        <DealerHand />
        <Hand
          // @ts-ignore
          name={name}
        />
        {isSplit ? (
          <Hand
            //@ts-ignore
            name={SPLIT_HAND}
          />
        ) : null}
        {dealStatus ? (
          ''
        ) : (
          <IonFab vertical="bottom" horizontal="center" slot="fixed">
            <IonFabButton onClick={() => startGame()}>Deal me!</IonFabButton>
          </IonFab>
        )}
        <IonFab vertical="bottom" horizontal="start" slot="fixed">
          {!stayStatus && dealStatus && activeHand === NORMAL && !playerBust ? (
            <>
              {doubleDownStatus ? (
                <IonFabButton onClick={() => doubleDown()}>
                  Double Down
                </IonFabButton>
              ) : (
                ''
              )}
              {offerSplit ? (
                <IonFabButton onClick={() => split()}>Split!</IonFabButton>
              ) : (
                ''
              )}
              <IonFabButton onClick={() => hit()}>Hit me!</IonFabButton>
              <IonFabButton onClick={() => stay()}>Stay</IonFabButton>
            </>
          ) : (
            ''
          )}
          {isSplit && splitDealStatus && !splitStayStatus && !splitBust ? (
            <>
              {splitDoubleDownStatus ? (
                <IonFabButton onClick={() => doubleDown()}>
                  split double down
                </IonFabButton>
              ) : null}
              <IonFabButton onClick={() => hit()}>split hit</IonFabButton>
              <IonFabButton onClick={() => stay()}>split stay</IonFabButton>
            </>
          ) : null}
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Board;
