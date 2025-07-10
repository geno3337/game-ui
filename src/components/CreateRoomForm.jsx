import { useState } from 'react';

export default function CreateRoomForm({ onCreate }) {
  const [playerId, setPlayerId] = useState(`player-${Math.floor(Math.random() * 10000)}`);
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!playerId || !playerName) {
      setError('Player ID and Name are required.');
      return;
    }
    setError('');
    onCreate({ id: playerId, name: playerName });
  };

  return (
    <div style={styles.form}>
      <h2>Create Game Room</h2>
      <input
        style={styles.input}
        placeholder="Player ID"
        value={playerId}
        onChange={e => setPlayerId(e.target.value)}
      />
      <input
        style={styles.input}
        placeholder="Player Name"
        value={playerName}
        onChange={e => setPlayerName(e.target.value)}
      />
      {error && <p style={styles.error}>{error}</p>}
      <button style={styles.button} onClick={handleCreate}>Create Room</button>
    </div>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '0.6rem 1.2rem',
    fontSize: '1rem',
    borderRadius: '5px',
    border: 'none',
    background: '#007bff',
    color: 'white',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
  },
};
