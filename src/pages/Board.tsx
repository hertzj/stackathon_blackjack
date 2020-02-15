import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
} from '@ionic/react';
import {
  addCircleOutline,
  add,
  hand,
  play,
  personAdd,
  refresh,
  copy,
} from 'ionicons/icons';
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
import { splitThunk, declineSplit } from '../redux/hands';
import { SPLIT_HAND, NORMAL } from '../redux/constants';
import { trackOptimalPlay } from '../redux/tracker';
import { NamePopOver } from './NamePopOver';
import { newGame } from '../redux';

const Board: React.FC = () => {
  const [stayStatus, setStay] = useState(false);
  const [dealStatus, setDeal] = useState(false);
  const [doubleDownStatus, setDouble] = useState(false);
  const [activeHand, setActiveHand] = useState(NORMAL);
  const [listStatus, setListStatus] = useState(false);

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
    setListStatus(false);
    if (isSplit && activeHand === NORMAL) {
      dispatch(trackOptimalPlay(name, 'stayed', false));
      setStay(true);
      dispatch(dealerHits());
    } else if (isSplit && activeHand === SPLIT_HAND) {
      dispatch(trackOptimalPlay(SPLIT_HAND, 'stayed', true));
      setSplitStay(true);
      setActiveHand(NORMAL);
      return;
    } else {
      dispatch(trackOptimalPlay(name, 'stayed', false));
      setStay(true);
      dispatch(dealerHits());
    }
  };

  const hit = () => {
    setListStatus(true);
    if (activeHand === NORMAL) {
      dispatch(trackOptimalPlay(name, 'hit', false));
      dispatch(hitParticipant(name));
      dispatch(declineSplit());
      setDouble(false);
    } else {
      dispatch(trackOptimalPlay(SPLIT_HAND, 'hit', true));
      dispatch(hitParticipant(SPLIT_HAND));
      setSplitDouble(false);
    }
  };

  const doubleDown = () => {
    if (activeHand === SPLIT_HAND) {
      dispatch(trackOptimalPlay(SPLIT_HAND, 'doubled down', true));
      dispatch(doubleDownThunk(SPLIT_HAND));
      setSplitDouble(false);
      setListStatus(true);
    } else {
      dispatch(trackOptimalPlay(name, 'doubled down', false));
      dispatch(doubleDownThunk(NORMAL));
      setDouble(false);
    }
    // stay();
  };

  const split = () => {
    dispatch(trackOptimalPlay(name, 'split', false));
    dispatch(splitThunk());
    setSplitDeal(true);
    setSplitDouble(true);
    setActiveHand(SPLIT_HAND);
  };

  const buttonList = () => {
    return (
      <IonFab vertical="bottom" horizontal="start" slot="fixed">
        <IonFabButton color="medium">
          Play
          {activeHand === SPLIT_HAND ? (
            <>
              <br /> split
            </>
          ) : (
            ''
          )}
        </IonFabButton>
        <IonFabList activated={listStatus} side="end">
          {!stayStatus && dealStatus && activeHand === NORMAL && !playerBust ? (
            <>
              {doubleDownStatus ? (
                <IonFabButton color="medium" onClick={() => doubleDown()}>
                  <IonIcon icon={addCircleOutline} />
                </IonFabButton>
              ) : (
                ''
              )}
              {offerSplit ? (
                <IonFabButton color="medium" onClick={() => split()}>
                  <IonIcon icon={copy} />
                </IonFabButton>
              ) : (
                ''
              )}
              <IonFabButton color="medium" onClick={() => hit()}>
                <IonIcon icon={add} />
              </IonFabButton>
              <IonFabButton color="medium" onClick={() => stay()}>
                <IonIcon icon={hand} />
              </IonFabButton>
            </>
          ) : (
            ''
          )}
          {isSplit && splitDealStatus && !splitStayStatus && !splitBust ? (
            <>
              {splitDoubleDownStatus ? (
                <IonFabButton color="medium" onClick={() => doubleDown()}>
                  <IonIcon icon={addCircleOutline} />
                </IonFabButton>
              ) : null}
              <IonFabButton color="medium" onClick={() => hit()}>
                <IonIcon icon={add} />
              </IonFabButton>
              <IonFabButton color="medium" onClick={() => stay()}>
                <IonIcon icon={hand} />
              </IonFabButton>
            </>
          ) : null}
        </IonFabList>
      </IonFab>
    );
  };

  const startNewGame = () => {
    dispatch(newGame());
    setDeal(false);
    setStay(false);
    setDouble(false);
    setActiveHand(NORMAL);
    setSplitStay(false);
    setSplitDeal(false);
    setSplitDouble(false);
    setListStatus(false);
  };

  const buttons = () => {
    if (result) return null;
    else {
      return (
        <>
          {dealStatus ? (
            buttonList()
          ) : (
            <IonFab vertical="bottom" horizontal="center" slot="fixed">
              <IonFabButton color="medium" onClick={() => startGame()}>
                <IonIcon icon={play} />
              </IonFabButton>
            </IonFab>
          )}
        </>
      );
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>BlackJack</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color="primary">
        <NamePopOver />
        {result ? (
          <>
            <h3>{result} won!!</h3>
            <IonFab vertical="bottom" horizontal="start" slot="fixed">
              <IonFabButton color="medium" onClick={() => startNewGame()}>
                <IonIcon icon={refresh} />
              </IonFabButton>
            </IonFab>
            <IonFab vertical="bottom" horizontal="end" slot="fixed">
              <IonFabButton color="medium" href="/tab1">
                <IonIcon icon={personAdd} />
              </IonFabButton>
            </IonFab>
          </>
        ) : (
          ''
        )}
        <DealerHand />
        <div
          style={{
            margin: '5px 0',
          }}
        ></div>
        <Hand
          // @ts-ignore
          name={name}
        />
        {isSplit ? (
          <>
            <div style={{ marginTop: '5px' }}></div>
            <Hand
              //@ts-ignore
              name={SPLIT_HAND}
            />
          </>
        ) : null}
        {buttons()}
      </IonContent>
    </IonPage>
  );
};

export default Board;
