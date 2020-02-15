import React, { useState, useEffect } from 'react';
import { IonPopover, IonButton, IonInput } from '@ionic/react';
import { useDispatch } from 'react-redux';
import { setPlayer } from '../redux/player';

export const NamePopOver: React.FC = () => {
  const [name, setName] = useState('');
  const [showPopover, setShowPopover] = useState(true);
  const dispatch = useDispatch();
  const submit = () => {
    setShowPopover(false);
    dispatch(setPlayer(name));
  };

  const handleChange = (ev: Event) => {
    if (ev.target) {
      // @ts-ignore
      setName(ev.target.value);
    }
  };
  return (
    <>
      <IonPopover
        isOpen={showPopover}
        onDidDismiss={() => setShowPopover(false)}
      >
        <IonInput value={name} onIonChange={ev => handleChange(ev)}></IonInput>
        <IonButton size="small" onClick={() => submit()}>
          Set Name
        </IonButton>
      </IonPopover>
    </>
  );
};
