import { useEffect, useRef } from 'react';
import $ from 'jquery';
import * as Chessboard from 'chessboardjs'; // Import Chessboard as a module
import { Chess } from 'chess.js'; // Correct import for Chess.js

if (typeof window !== 'undefined') {
  (window as any).$ = (window as any).jQuery = $;
}

const Board: React.FC = () => {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const game = useRef(new Chess()).current;
  let board: any = null;

  useEffect(() => {
    if (boardRef.current) {
      board = (Chessboard as any).default(boardRef.current, { // Use .default if needed
        draggable: true,
        dropOffBoard: 'snapback',
        position: 'start',
        pieceTheme: (piece: string) => `/chesspieces/${piece}.png`,
        onDrop: (source: string, target: string) => {
          const move = game.move({ from: source, to: target });
          if (!move) return 'snapback'; // Invalid move
        },
      });

      // Resize board on window resize
      const handleResize = () => {
        board.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        board.destroy(); // Cleanup on unmount
      };
    }
  }, [game]);

  return <div id="chessboard" ref={boardRef} style={{ width: '100%' }} />;
};

export default Board;
