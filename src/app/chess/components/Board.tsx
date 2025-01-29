import { useMemo, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, type Square } from "chess.js";
import Engine from "./engine";
import type { Piece } from "react-chessboard/dist/chessboard/types";

export const PlayVsComputer = () => {
  const pieces = ["wP", "wN", "wB", "wR", "wQ", "wK", "bP", "bN", "bB", "bR", "bQ", "bK"];
  const customPieces = useMemo(() => {
    const pieceComponents = {};
    for (const piece of pieces) {
      pieceComponents[piece] = ({ squareWidth }) => (
        <div
          style={{
            width: squareWidth,
            height: squareWidth,
            backgroundImage: `url(./chesspieces/${piece}.png)`,
            backgroundSize: "100%",
          }}
        />
      );
    }
    return pieceComponents;
  }, []);

  const engine = useMemo(() => new Engine(), []);
  const game = useMemo(() => new Chess(), []);
  const [won, setWon] = useState<"black" | "white" | "draw" | null>();
  const [gamePosition, setGamePosition] = useState(game.fen());
  const [stockfishLevel, setStockfishLevel] = useState(2);

  const [moveFrom, setMoveFrom] = useState("");
  const [moveTo, setMoveTo] = useState<Square | null>(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [moveSquares, setMoveSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});

  function checkEnd(side: "black" | "white") {
    if (game.isDraw()) setWon("draw");
    if (game.isCheckmate()) setWon(side);
  }

  function findBestMove() {
    engine.evaluatePosition(game.fen(), stockfishLevel);

    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        game.move(bestMove);
        setGamePosition(game.fen()); // Update position to trigger animation
        checkEnd("black");
      }
    });
  }

  function getMoveOptions(square) {
    const moves = game.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }
    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) && game.get(move.to).color !== game.get(square).color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
    return true;
  }

  function onSquareClick(square) {
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
        moveFrom,
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

  function onPromotionPieceSelect(piece) {
    // if no piece passed then user has cancelled dialog, don't make move and reset
    if (piece) {
      const move = game.move({
        from: moveFrom,
        to: moveTo,
        promotion: piece[1].toLowerCase() ?? "q",
      });
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

  function onSquareRightClick(square) {
    const colour = "rgba(0, 0, 255, 0.4)";
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] && rightClickedSquares[square].backgroundColor === colour
          ? undefined
          : { backgroundColor: colour },
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