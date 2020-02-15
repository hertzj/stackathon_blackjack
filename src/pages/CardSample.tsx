import React from 'react';
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
import Card from '../CardTest/Card';

const CardExample: React.FC = () => {
  return (
    <IonContent>
      <IonRow>
        <IonItem color="primary">
          <IonCol sizeSm="2">
            <Card rank={null} suit={null} />
          </IonCol>
        </IonItem>
      </IonRow>
    </IonContent>
  );
};

export default CardExample;
