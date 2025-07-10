import { useEffect, useRef } from 'react';

export default function GameLoop({ playerId, roomId, stompClient }) {
  const pressedKeys = useRef({});

  const sendAction = (type) => {
    if (!stompClient || !stompClient.connected) return;
    stompClient.publish({
      destination: '/app/action',
      body: JSON.stringify({ playerId, roomId, type }),
    });
  };

  const handleKeyDown = (e) => {
    const keyMap = {
      ArrowUp: 'MOVE_UP',
      ArrowDown: 'MOVE_DOWN',
      Enter: 'FIRE',
    };
    const action = keyMap[e.key];
    if (action && !pressedKeys.current[e.key]) {
      pressedKeys.current[e.key] = true;
      sendAction(action);
    }
  };

  const handleKeyUp = (e) => {
    const keyMap = {
      ArrowUp: 'STOP_MOVE_UP',
      ArrowDown: 'STOP_MOVE_DOWN',
    };
    if (pressedKeys.current[e.key]) {
      pressedKeys.current[e.key] = false;

      // // Optionally inform server when movement stops
      // const stopAction = keyMap[e.key];
      // if (stopAction) {
      //   sendAction(stopAction);
      // }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return null;
}
