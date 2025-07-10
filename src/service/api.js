const BASE_URL = process.env.REACT_APP_API_URL + '/api/game';

export async function createRoom(player) {
  console.log('base url', BASE_URL);
  const res = await fetch(`${BASE_URL}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(player),
  });
  return res.text(); // returns roomId
}

export async function joinRoom(roomId, player) {
  const res = await fetch(`${BASE_URL}/join/${roomId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(player),
  });
  return res.text(); // "Joined"
}
