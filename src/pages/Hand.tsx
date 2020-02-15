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
  IonItem,
} from '@ionic/react';
import { connect } from 'react-redux';
import { hitParticipant } from '../redux/deck';
// @ts-ignore
// import Card from 'react-playing-card';
import { ScoreState } from '../redux/score';
import Card from '../CardTest/Card';
import { useDispatch, useSelector } from 'react-redux';
import { SPLIT_HAND } from '../redux/constants';

interface PlayerCard {
  value: string;
  faceUp: boolean;
}

interface MyState {
  cards: PlayerCard[];
  name: string;
  value: number;
}

const Hand: React.FC = props => {
  // @ts-ignore
  const name: string = props.name;

  // @ts-ignore
  const playerHand = useSelector(state => state.hands.playerHand);
  // @ts-ignore
  const playerBust = useSelector(state => state.score.playerBust);

  // @ts-ignore
  const splitCards = useSelector(state => state.hands.playerSplitHand);
  //@ts-ignore
  const splitBust = useSelector(state => state.score.playerSplitBust);

  const split: boolean = name === SPLIT_HAND ? true : false;

  const normalHand = () => {
    return (
      <IonRow>
        {playerHand.map((card: PlayerCard, idx: number) => {
          const { value, faceUp } = card;
          if (faceUp === false) {
            return (
              <IonItem key={idx} color="primary">
                <IonCol color="primary" sizeSm="2" key={idx}>
                  <Card rank={null} suit={null} />
                </IonCol>
              </IonItem>
            );
          }
          const suit = value.slice(0, 1);
          const cardVal = value.slice(1);
          return (
            <IonItem key={idx} color="primary">
              <IonCol color="primary" sizeSm="2" key={idx}>
                <Card rank={cardVal} suit={suit} />
              </IonCol>
            </IonItem>
          );
        })}
      </IonRow>
    );
  };

  const splitHand = () => {
    return (
      <IonRow>
        {splitCards.map((card: PlayerCard, idx: number) => {
          const { value, faceUp } = card;
          if (faceUp === false) {
            return (
              <IonItem color="primary" key={idx}>
                <IonCol sizeSm="2" key={idx}>
                  <Card rank={null} suit={null} />
                </IonCol>
              </IonItem>
            );
          }
          const suit = value.slice(0, 1);
          const cardVal = value.slice(1);
          return (
            <IonItem color="primary" key={idx}>
              <IonCol sizeSm="2" key={idx}>
                <Card rank={cardVal} suit={suit} />
              </IonCol>
            </IonItem>
          );
        })}
      </IonRow>
    );
  };

  if (!playerHand.length) {
    return <h1>loading...</h1>;
  }
  return (
    <>
      {playerBust && split === false ? <h1>{name} busted</h1> : null}
      {splitBust && split === true ? <h1>split hand busted</h1> : null}
      <IonGrid fixed>{split ? splitHand() : normalHand()}</IonGrid>
    </>
  );
};

export default Hand;

// class Hand extends Component<any, MyState> {
//   constructor(props: any) {
//     super(props);
//   }

//   render() {
//     const { name, hands, score } = this.props;
//     // need to handle splitting
//     const { playerHand } = hands;
//     const { playerBust } = score;
//     if (!playerHand.length) {
//       return <h1>loading...</h1>;
//     } else if (playerBust) {
//       return <h1>{name} Busted!!!!</h1>;
//     }
//     return (
//       <IonGrid fixed>
//         <IonRow>
//           {playerHand.map((card: PlayerCard, idx: number) => {
//             const { value, faceUp } = card;
//             if (faceUp === false) {
//               return (
//                 <IonCol sizeSm="2" key={idx}>
//                   <Card rank={null} suit={null} />
//                 </IonCol>
//               );
//             }
//             const suit = value.slice(0, 1);
//             const cardVal = value.slice(1);
//             return (
//               <IonCol sizeSm="2" key={idx}>
//                 <Card rank={cardVal} suit={suit} />
//               </IonCol>
//             );
//           })}
//         </IonRow>
//       </IonGrid>
//     );
//     // }
//   }
// }

// const mapStateToProps = ({
//   hands,
//   score,
// }: // player,
// {
//   hands: PlayerCard[];
//   score: ScoreState;
//   // player: string;
// }) => ({ hands, score });

// const mapDispatchToProps = (dispatch: any) => {
//   return {
//     hitParticipant: (player: string) => dispatch(hitParticipant(player)),
//   };
// };

// const connectedHand = connect(mapStateToProps, mapDispatchToProps)(Hand);

// export default withIonLifeCycle(connectedHand);
