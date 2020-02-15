import React, { useState } from 'react';
import { IonPopover } from '@ionic/react';

export const BustPopOver: React.FC = props => {
  // @ts-ignore
  const { name }: { name: string } = props;
  const [showPopover, setShowPopover] = useState(true);
  return (
    <IonPopover isOpen={showPopover} onDidDismiss={() => setShowPopover(false)}>
      <h4>{name} busted</h4>
    </IonPopover>
  );
};
