import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import stompClient from './websocket/socket';
import { updateGameState } from './store/gameSlice';
import GameCanvas from './components/GameCanvas';
import GameLoop from './components/GameLoop';
import { createRoom, joinRoom } from './service/api';
import CreateRoomForm from './components/CreateRoomForm';
import JoinRoomForm from './components/JoinRoomForm';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let stompClient = null;

export default function App() {
  const dispatch = useDispatch();
  const gameState = useSelector(state => state.game);

  const [playerId, setPlayerId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [joined, setJoined] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [mode, setMode] = useState('create'); // 'create' or 'join'

  const connectWebSocket = room =>{
     stompClient = new Client({
        webSocketFactory: () => new SockJS('http://localhost:4000/ws'),
        connectHeaders: {},
        debug: (str) => {
            console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
            stompClient.subscribe('/topic/room/'+room, (message) => {
              const gameData = JSON.parse(message.body);
              console.log('Received game data:', gameData);
              dispatch(updateGameState(gameData));
              setGameStarted(true);
            });
        },
        onStompError: (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        }
    });

    stompClient.activate();
  }


  const handleCreateRoom = async (player) => {
    const newRoomId = await createRoom(player);
    setPlayerId(player.id);
    setRoomId(newRoomId);
    setJoined(true);
    await connectWebSocket(newRoomId);
  };

  const handleJoinRoom = async (player, joinRoomId) => {
    await joinRoom(joinRoomId, player);
    setPlayerId(player.id);
    setRoomId(joinRoomId);
    setJoined(true);
    await connectWebSocket(joinRoomId);
  };

  const handleStartGame = () => {
    if (gameState.player1 && gameState.player2) {
      setGameStarted(true);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: 'auto' }}>
      {!joined ? (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <button onClick={() => setMode('create')} style={mode === 'create' ? styles.activeTab : styles.tab}>Create Room</button>
            <button onClick={() => setMode('join')} style={mode === 'join' ? styles.activeTab : styles.tab}>Join Room</button>
          </div>
          {mode === 'create'
            ? <CreateRoomForm onCreate={handleCreateRoom} />
            : <JoinRoomForm onJoin={handleJoinRoom} />}
        </>
      ) : !gameStarted ? (
        <div style={{ textAlign: 'center' }}>
          <h2>Room ID: {roomId}</h2>
          <p>Waiting for second player...</p>
          <ul style={{ listStyle: 'none' }}>
            {gameState.player1 && <li>✅ {gameState.player1.name}</li>}
            {gameState.player2 && <li>✅ {gameState.player2.name}</li>}
          </ul>
          <button onClick={handleStartGame} style={styles.button}>Start Game</button>
        </div>
      ) : (
        <>
          <h3 style={{ textAlign: 'center' }}>Room: {roomId}</h3>
          <GameCanvas />
          <GameLoop playerId={playerId} roomId={roomId} stompClient={stompClient} />
        </>
      )}
    </div>
  );
}

const styles = {
  tab: {
    padding: '0.5rem 1rem',
    marginRight: '0.5rem',
    cursor: 'pointer',
    border: '1px solid #ccc',
    backgroundColor: '#eee',
  },
  activeTab: {
    padding: '0.5rem 1rem',
    marginRight: '0.5rem',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: '#fff',
    border: '1px solid #007bff',
  },
  button: {
    padding: '0.6rem 1.2rem',
    fontSize: '1rem',
    borderRadius: '5px',
    border: 'none',
    background: '#28a745',
    color: 'white',
    cursor: 'pointer',
    marginTop: '1rem',
  },
};
