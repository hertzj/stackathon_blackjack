import React, { Component } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  withIonLifeCycle,
  IonRow,
  IonGrid,
  IonCol,
  IonFab,
  IonFabButton,
} from '@ionic/react';
import { connect } from 'react-redux';
import { hitParticipant } from '../redux/deck';
// @ts-ignore
// import Card from 'react-playing-card';
import { ScoreState } from '../redux/score';
import Card from ;

interface PlayerCard {
  value: string;
  faceUp: boolean;
}

interface MyState {
  cards: PlayerCard[];
  name: string;
  value: number;
}

class Hand extends Component<any, MyState> {
  constructor(props: any) {
    super(props);
    this.state = {
      cards: [],
      name: '',
      value: 0,
    };
  }

  // need check pair and split
  hit = () => {
    const { player } = this.props;
    this.props.hitParticipant(player);
  };

  render() {
    const { player, hands, score } = this.props;
    // console.log('hi: ', this.props);
    if (player === 'dealer') {
      const { dealerHand } = hands;
      const { dealerBust } = score;
      if (!dealerHand.length) {
        return (
          <IonPage>
            <IonContent>loading...</IonContent>
          </IonPage>
        );
      } else if (dealerBust) {
        return (
          <IonPage>
            <IonContent>Busted!!!!</IonContent>
          </IonPage>
        );
      }
      return (
        <IonPage>
          <IonContent>
            <IonGrid fixed>
              <IonRow>
                {dealerHand.map((card: PlayerCard, idx: number) => {
                  const { value } = card;
                  const suit = value.slice(0, 1);
                  const cardVal = value.slice(1);
                  return (
                    <IonCol sizeSm="2" key={idx}>
                      <Card rank={cardVal} suit={suit} />
                    </IonCol>
                  );
                })}
              </IonRow>
            </IonGrid>
          </IonContent>
        </IonPage>
      );
    } else {
      // need to handle splitting
      const { playerHand } = hands;
      const { playerBust } = score;
      if (!playerHand.length) {
        return (
          <IonPage>
            <IonContent>loading...</IonContent>
          </IonPage>
        );
      } else if (playerBust) {
        return (
          <IonPage>
            <IonContent>{player} Busted!!!!</IonContent>
          </IonPage>
        );
      }
      return (
        <IonPage>
          <IonContent>
            <IonGrid>
              <IonRow>
                {playerHand.map((card: PlayerCard, idx: number) => {
                  const { value } = card;
                  const suit = value.slice(0, 1);
                  const cardVal = value.slice(1);
                  return (
                    <IonCol key={idx}>
                      <Card rank={cardVal} suit={suit} />
                    </IonCol>
                  );
                })}
              </IonRow>
            </IonGrid>
            <IonFab vertical="bottom" horizontal="center" slot="fixed">
              <IonFabButton onClick={() => this.hit()}>Hit me!</IonFabButton>
            </IonFab>
          </IonContent>
        </IonPage>
      );
    }
  }
}

// interface HandsState {
//   playerHand: PlayerCard[];
//   dealerHand: PlayerCard[];
//   playerSplitHand: PlayerCard[];
// }
// const mapStateToProps = (state: any) => {
//   return state.hands;
// };

const mapStateToProps = ({
  hands,
  score,
  player,
}: {
  hands: PlayerCard[];
  score: ScoreState;
  player: string;
}) => ({ hands, score, player });

const mapDispatchToProps = (dispatch: any) => {
  return {
    hitParticipant: (player: string) => dispatch(hitParticipant(player)),
  };
};

const connectedHand = connect(mapStateToProps, mapDispatchToProps)(Hand);

export default withIonLifeCycle(connectedHand);
