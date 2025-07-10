import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

export default function GameCanvas() {
  const canvasRef = useRef(null);

  const gameState = useSelector(state => state.game);
  const { player1, player2, bulletList = [] } = gameState;

  useEffect(() => {
    const drawGame = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#222';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawPlayer(ctx, player1);
      drawPlayer(ctx, player2);

      // Safe bullet rendering
      if (Array.isArray(bulletList)) {
        bulletList.forEach(bullet => {
          ctx.fillStyle = bullet.owner === 'player1' ? 'lightblue' : 'orange';
          ctx.fillRect(bullet.x, bullet.y, bullet.width || 10, bullet.height || 10);
        });
      }

      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.fillText(`Player 1 Health: ${player1?.health ?? 0}`, 20, 30);
      ctx.fillText(`Player 2 Health: ${player2?.health ?? 0}`, 600, 30);
    };


    drawGame(); // Draw once on state update
  }, [gameState]);

  const drawPlayer = (ctx, player) => {
    if (!player) return;
    ctx.fillStyle = player.color || 'gray';
    ctx.fillRect(player.x, player.y, player.width, player.height);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        style={{ border: '2px solid black', backgroundColor: '#111' }}
      />
    </div>
  );
}
