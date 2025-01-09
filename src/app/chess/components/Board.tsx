import { useEffect, useRef } from 'react';
import $ from 'jquery';
import Chessboard from 'chessboardjs';

if (typeof window !== 'undefined') {
  (window as any).$ = (window as any).jQuery = $;
}

const ChessboardComponent: React.FC = () => {
  const boardRef = useRef<HTMLDivElement | null>(null);
  let board: any = null;

  useEffect(() => {
    if (boardRef.current) {
      board = Chessboard(boardRef.current, {
        draggable: true,
        dropOffBoard: 'snapback',
        position: 'start',
        pieceTheme: (piece: string) => `/chesspieces/${piece}.png`,
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
  }, []);

  return <div id="chessboard" ref={boardRef} style={{ width: '100%' }} />;
};

export default ChessboardComponent;
