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

interface PlayerCard {
  value: string;
  faceUp: boolean;
}

interface MyState {
  cards: PlayerCard[];
  name: string;
  value: number;
}

const DealerHand: React.FC = () => {
  // @ts-ignore
  const dealerHand = useSelector(state => state.hands.dealerHand);
  // @ts-ignore
  const dealerBust = useSelector(state => state.score.dealerBust);
  if (!dealerHand.length) {
    return <h1>loading...</h1>;
  }
  return (
    <>
      {dealerBust ? <h1>hooray, the dealer busted!</h1> : null}
      <IonGrid fixed>
        <IonRow>
          {dealerHand.map((card: PlayerCard, idx: number) => {
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
      </IonGrid>
    </>
  );
};

export default DealerHand;

// class DealerHand extends Component<any, MyState> {
//   // eslint-disable-next-line @typescript-eslint/no-useless-constructor
//   constructor(props: any) {
//     super(props);
//   }

//   // need check pair and split
//   // hit = () => {
//   //   const { player } = this.props;
//   //   this.props.hitParticipant(player);
//   // };

//   render() {
//     const { hands, score } = this.props;
//     // console.log('hi: ', this.props);
//     const { dealerHand } = hands;
//     const { dealerBust } = score;
//     if (!dealerHand.length) {
//       return <h1>loading...</h1>;
//     } else if (dealerBust) {
//       return <h1>Dealer Busted!!!!</h1>;
//     }
//     return (
//       <IonGrid fixed>
//         <IonRow>
//           {dealerHand.map((card: PlayerCard, idx: number) => {
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

// const connectedDealerHand = connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(DealerHand);

// export default withIonLifeCycle(connectedDealerHand);
