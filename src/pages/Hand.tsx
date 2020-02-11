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
import Card from 'react-playing-card';

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

  // ionViewWillEnter() {
  //   const { hands } = this.props;
  //   const { name } = this.props;

  //   if (name === 'dealer') {
  //     const { dealerHand } = hands;
  //     this.setState({
  //       cards: dealerHand,
  //       name,
  //     });
  //   } else {
  //     const { playerHand } = hands;
  //     this.setState({
  //       cards: playerHand,
  //       name,
  //     });
  //   }
  // }

  // value = () => {
  //   // should probably handle this in the redux store
  //   const { cards } = this.state;
  //   const mapRoyalToVal: { [key in Royals]: number } = {
  //     J: 10,
  //     Q: 10,
  //     K: 10,
  //     A: 11,
  //   };
  //   const royalKeys = Object.keys(mapRoyalToVal) as Royals[];
  //   const value = cards.reduce((acc: number, card: PlayerCard) => {
  //     const cardVal = card.value.slice(1) as Royals; // a little worried about this as Royals
  //     let num: string | number = cardVal;
  //     if (acc > 21 && royalKeys.indexOf(cardVal) === 4) {
  //       num = '1';
  //     } else if (royalKeys.indexOf(cardVal) === 4 && acc + 11 > 21) {
  //       num = '1';
  //     } else if (royalKeys.indexOf(cardVal) > -1) {
  //       num = mapRoyalToVal[cardVal];
  //     }
  //     acc += Number(num);
  //     return acc;
  //   }, 0);
  //   this.setState({ value });
  // };

  // need check pair and split
  hit = () => {
    const { name } = this.state;
    this.props.hitParticipant(name);
  };

  render() {
    const { name } = this.props;
    console.log(this.props);
    if (name === 'dealer') {
      const { dealerHand } = this.props;
      if (!dealerHand.length) {
        return (
          <IonPage>
            <IonContent>loading...</IonContent>
          </IonPage>
        );
      }
      return (
        <IonPage>
          <IonContent>
            <IonGrid>
              <IonRow>
                {dealerHand.map((card: PlayerCard) => {
                  const { value } = card;
                  const suit = value.slice(0, 1);
                  const cardVal = value.slice(1);
                  return (
                    <IonCol>
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
      const { playerHand } = this.props;
      if (!playerHand.length) {
        return (
          <IonPage>
            <IonContent>loading...</IonContent>
          </IonPage>
        );
      }
      return (
        <IonPage>
          <IonContent>
            <IonGrid>
              <IonRow>
                {playerHand.map((card: PlayerCard) => {
                  const { value } = card;
                  const suit = value.slice(0, 1);
                  const cardVal = value.slice(1);
                  return (
                    <IonCol>
                      <Card rank={cardVal} suit={suit} />
                    </IonCol>
                  );
                })}
              </IonRow>
            </IonGrid>
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
const mapStateToProps = (state: any) => {
  return state.hands;
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    hitParticipant: (player: string) => dispatch(hitParticipant(player)),
  };
};

const connectedHand = connect(mapStateToProps, mapDispatchToProps)(Hand);

export default withIonLifeCycle(connectedHand);
