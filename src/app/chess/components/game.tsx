"use client";

import { JSX, useCallback, useEffect, useMemo, useState } from "react";
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

export const PlayVsComputer = ({
  aiAssistantActive,
  level = 1,
}: {
  aiAssistantActive: boolean;
  level: number;
}) => {
  const customPieces = useMemo(() => {
    const pieces = [
      "wP",
      "wN",
      "wB",
      "wR",
      "wQ",
      "wK",
      "bP",
      "bN",
      "bB",
      "bR",
      "bQ",
      "bK",
    ];
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
  engine.stockfish?.postMessage(`setoption name Skill Level value ${level}`);
  const game = useMemo(() => new Chess(), []);
  const [, setWon] = useState<"black" | "white" | "draw" | null>();
  const [gamePosition, setGamePosition] = useState(game.fen());

  const [moveFrom, setMoveFrom] = useState<string>("");
  const [moveTo, setMoveTo] = useState<Square | null>(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);

  const [bestLine, setBestline] = useState("");

  const [rightClickedSquares, setRightClickedSquares] = useState<SquareStyles>(
    {}
  );
  const [moveSquares] = useState<SquareStyles>({});
  const [optionSquares, setOptionSquares] = useState<SquareStyles>({});

  function checkEnd(side: "black" | "white") {
    if (game.isDraw()) setWon("draw");
    if (game.isCheckmate()) setWon(side);
  }

  const findBestMove = useCallback(() => {
    if (game.turn() === "w") {
      engine.evaluatePosition(game.fen(), 10);
    } else {
      setTimeout(() => {
        engine.evaluatePosition(game.fen(), 10);
      }, 500);
    }

    engine.onMessage?.(({ bestMove, pv }) => {
      if (game.turn() === "w" && pv) setBestline(pv);
      if (game.turn() === "b" && bestMove) game.move(bestMove);
      setGamePosition(game.fen());
    });
  }, [engine, game]);

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
          game.get(move.to) &&
          game.get(move.to).color !== game.get(square).color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
    });
    newSquares[square] = {
      background: "rgba(251, 0, 255, 0.4)",
    };
    setOptionSquares(newSquares);
    return true;
  }

  function onSquareClick(square: Square) {
    setRightClickedSquares({});

    if (!moveFrom) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) setMoveFrom(square);
      return;
    }

    if (!moveTo) {
      const moves = game.moves({
        square: moveFrom as Square,
        verbose: true,
      });
      const foundMove = moves.find(
        (m) => m.from === moveFrom && m.to === square
      );
      if (!foundMove) {
        const hasMoveOptions = getMoveOptions(square);
        setMoveFrom(hasMoveOptions ? square : "");
        return;
      }

      setMoveTo(square);

      if (
        (foundMove.color === "w" &&
          foundMove.piece === "p" &&
          square[1] === "8") ||
        (foundMove.color === "b" &&
          foundMove.piece === "p" &&
          square[1] === "1")
      ) {
        setShowPromotionDialog(true);
        return;
      }

      const move = game.move({
        from: moveFrom,
        to: square,
        promotion: "q",
      });

      if (move === null) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) setMoveFrom(square);
        return;
      }
      setGamePosition(game.fen());
      checkEnd("white");
      setMoveFrom("");
      setMoveTo(null);
      setOptionSquares({});
      setBestline("");
      findBestMove();
      return;
    }
  }

  useEffect(() => {
    if (!game.isGameOver() || game.isDraw()) {
      findBestMove();
    }
  }, [findBestMove, game, gamePosition]);

  const bestMove = bestLine?.split(" ")?.[0];

  function onPromotionPieceSelect(piece?: PromotionPieceOption): boolean {
    if (piece) {
      const promotionPiece = piece[1].toLowerCase();
      const move = game.move({
        from: moveFrom,
        to: moveTo!,
        promotion: promotionPiece,
      });

      if (move === null) {
        return false;
      }

      setGamePosition(game.fen());
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
        delete newSquares[square];
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
        animationDuration={300}
        arePiecesDraggable={false}
        customArrows={
          aiAssistantActive && bestMove
            ? [
                [
                  bestMove.substring(0, 2) as Square,
                  bestMove.substring(2, 4) as Square,
                  "rgba(251, 0, 255, 1)",
                ],
              ]
            : []
        }
      />
      {/* <div className="flex gap-5 items-center mt-5">
        <Switch
          checked={aiAssistantActive}
          onCheckedChange={setAiAssistantActive}
          className="data-[state=checked]:bg-[#FF00F6] data-[state=unchecked]:bg-gray-500
                 relative h-7 w-[50px] rounded-full transition-colors 
                 before:absolute before:left-1 before:top-1 before:h-4 before:w-4 
                 before:rounded-full before:bg-white before:shadow-md 
                 before:transition-transform before:duration-200 
                 data-[state=checked]:before:translate-x-6 items-center"
        />
        <h1 className="text-2xl">
          <span className="color">AI</span> Asistent
        </h1>
      </div> */}
    </div>
  );
};
