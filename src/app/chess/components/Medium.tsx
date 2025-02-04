"use client"

import { JSX, useMemo, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, type Square } from "chess.js";
import Engine from "./engine";
import { PromotionPieceOption } from "react-chessboard/dist/chessboard/types";

// Type for state managing squares with custom styles (right-clicked, move options, etc.)
interface SquareStyles {
  [key: string]: {
    backgroundColor?: string;
    background?: string;
    borderRadius?: string;
  };
}

export const PlayVsComputer = () => {
  // Custom pieces JSX component
  const customPieces = useMemo(() => {
    const pieces = ["wP", "wN", "wB", "wR", "wQ", "wK", "bP", "bN", "bB", "bR", "bQ", "bK"];
    interface PieceComponents {
      [key: string]: (props: { squareWidth: number }) => JSX.Element;
    }
    const pieceComponents: PieceComponents = {};
    for (const piece of pieces) {
      pieceComponents[piece] = ({ squareWidth }) => (
        <div
          style={{
            width: squareWidth,
            height: squareWidth,
            backgroundImage: `url(/chesspieces/${piece}.png)`,
            backgroundSize: "100%",
          }}
        />
      );
    }
    return pieceComponents;
  }, []);

  const engine = useMemo(() => new Engine(), []);
  const game = useMemo(() => new Chess(), []);
  const [, setWon] = useState<"black" | "white" | "draw" | null>();
  const [gamePosition, setGamePosition] = useState(game.fen());

  // State for selecting difficulty level
  engine.stockfish?.postMessage("setoption name Skill Level value 10"); // Easy level setting 

  const [moveFrom, setMoveFrom] = useState<string>("");
  const [moveTo, setMoveTo] = useState<Square | null>(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);

  // Explicit types for squares with styles
  const [rightClickedSquares, setRightClickedSquares] = useState<SquareStyles>({});
  const [moveSquares] = useState<SquareStyles>({});
  const [optionSquares, setOptionSquares] = useState<SquareStyles>({});

  function checkEnd(side: "black" | "white") {
    if (game.isDraw()) setWon("draw");
    if (game.isCheckmate()) setWon(side);
  }

  function findBestMove() {
    // Map difficulty level to depth
    setTimeout(() => {


      engine.evaluatePosition(game.fen(), 4);


    }, 1000)

    engine.onMessage?.(({ bestMove }) => {
      if (!bestMove || bestMove.length < 4) {
        return;
      }

      console.log("Best move from engine:", bestMove);
      console.log("Current FEN:", game.fen());

      const move = {
        from: bestMove.substring(0, 2) as Square,
        to: bestMove.substring(2, 4) as Square,
        promotion: bestMove.length > 4 ? (bestMove[4] as PromotionPieceOption) : undefined,
      };

      console.log("Parsed move object:", move);

      // Validate the move
      const validMoves = game.moves({ square: move.from, verbose: true });

      if (validMoves.length === 0) {
      } else {
        console.log(`Valid moves for ${move.from}:`, validMoves);
      }

      const isValidMove = validMoves.some((m) => m.to === move.to);
      if (!isValidMove) {
        return;
      }

      // Apply the move
      const result = game.move(move);
      if (result === null) {
        console.error("Game rejected the move:", move);
      } else {
        setGamePosition(game.fen());
        checkEnd("black");
      }
    });
  }

  function getMoveOptions(square: Square) {
    const moves = game.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }
    const newSquares: SquareStyles = {};
    moves.forEach((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) && game.get(move.to).color !== game.get(square).color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
    return true;
  }

  function onSquareClick(square: Square) {
    setRightClickedSquares({});

    // from square
    if (!moveFrom) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) setMoveFrom(square);
      return;
    }

    // to square
    if (!moveTo) {
      // check if valid move before showing dialog
      const moves = game.moves({
        square: moveFrom as Square,
        verbose: true,
      });
      const foundMove = moves.find((m) => m.from === moveFrom && m.to === square);
      // not a valid move
      if (!foundMove) {
        // check if clicked on new piece
        const hasMoveOptions = getMoveOptions(square);
        // if new piece, setMoveFrom, otherwise clear moveFrom
        setMoveFrom(hasMoveOptions ? square : "");
        return;
      }

      // valid move
      setMoveTo(square);

      // if promotion move
      if (
        (foundMove.color === "w" && foundMove.piece === "p" && square[1] === "8") ||
        (foundMove.color === "b" && foundMove.piece === "p" && square[1] === "1")
      ) {
        setShowPromotionDialog(true);
        return;
      }

      // is normal move
      const move = game.move({
        from: moveFrom,
        to: square,
        promotion: "q",
      });

      // if invalid, setMoveFrom and getMoveOptions
      if (move === null) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) setMoveFrom(square);
        return;
      }
      setGamePosition(game.fen()); // Update position to trigger animation
      checkEnd("white");
      setMoveFrom("");
      setMoveTo(null);
      setOptionSquares({});
      findBestMove();
      return;
    }
  }

  function onPromotionPieceSelect(piece?: PromotionPieceOption): boolean {
    // if no piece passed then user has cancelled dialog, don't make move and reset
    if (piece) {
      // Remove the color prefix from the promotion piece
      const promotionPiece = piece[1].toLowerCase(); // Extracts 'q' from 'wQ' or 'bQ'
  
      const move = game.move({
        from: moveFrom,
        to: moveTo!,
        promotion: promotionPiece,
      });
  
      if (move === null) {
        return false;
      }
  
      setGamePosition(game.fen()); // Update position to trigger animation
      checkEnd("white");
      findBestMove();
    }
  
    setMoveFrom("");
    setMoveTo(null);
    setShowPromotionDialog(false);
    setOptionSquares({});
    return true;
  }

  function onSquareRightClick(square: Square) {
    const colour = "rgba(0, 0, 255, 0.4)";

    setRightClickedSquares((prev) => {
      const newSquares = { ...prev };

      if (newSquares[square] && newSquares[square].backgroundColor === colour) {
        delete newSquares[square]; // Properly remove the property
      } else {
        newSquares[square] = { backgroundColor: colour };
      }

      return newSquares;
    });
  }

  return (
    <div className="w-[100vw] md:w-[500px]">
      <Chessboard
        position={gamePosition}
        onSquareClick={onSquareClick}
        onSquareRightClick={onSquareRightClick}
        onPromotionPieceSelect={onPromotionPieceSelect}
        customPieces={customPieces}
        customDarkSquareStyle={{
          backgroundColor: "#94568B",
        }}
        customLightSquareStyle={{
          backgroundColor: "#ECD0E9",
        }}
        customSquareStyles={{
          ...moveSquares,
          ...optionSquares,
          ...rightClickedSquares,
        }}
        promotionToSquare={moveTo}
        showPromotionDialog={showPromotionDialog}
        animationDuration={300} // Enable animations with a duration of 300ms
        arePiecesDraggable={false} // Disable dragging for "click to move"
      />
    </div>
  );
};
