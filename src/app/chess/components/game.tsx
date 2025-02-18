"use client";

import { JSX, useCallback, useEffect, useMemo, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, type Square } from "chess.js";
import Engine from "./engine";
import { PromotionPieceOption } from "react-chessboard/dist/chessboard/types";
import Link from "next/link";

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
  const [gameOver, setGameOver] = useState<{ isOver: boolean; result: string }>(
    {
      isOver: false,
      result: "",
    }
  );
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

  function checkEnd(side: "b" | "w") {
    let result = "";
    if (game.isDraw()) {
      result = "Draw";
    } else if (game.isCheckmate()) {
      result = `Checkmate: ${side === "w" ? "White" : "Black"} Wins`;
    }

    if (result) {
      setGameOver({ isOver: true, result });
  
      // Send result to the backend
      sendGameResult(result);
    } 
  }

  const sendGameResult = async (result: string) => {
    const token = localStorage.getItem("token"); // Get token from local storage
  
    if (!token) {
      console.error("No token found in local storage");
      return;
    }
  
    console.log("Sending request with token:", token);
  
    const win = result.includes("White Wins") ? 1 : 0;
    const lose = result.includes("Black Wins") ? 1 : 0;
  
    try {
      const response = await fetch("http://37.46.208.126:5001/api/game-result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Ensure correct format
        },
        body: JSON.stringify({
          level,
          win,
          lose,
        }),
      });
  
      const data = await response.json();
      console.log("Response from server:", data);
  
      if (!response.ok) {
        console.error("Server responded with:", response.status, data);
      }
    } catch (error) {
      console.error("Failed to send game result:", error);
    }
  };
  

  const findBestMove = useCallback(() => {
    if (game.turn() === "w") {
      engine.evaluatePosition(game.fen(), 20);
    } else {
      setTimeout(() => {
        engine.evaluatePosition(game.fen(), level);
      }, 500);
    }

    engine.onMessage?.(({ bestMove, pv }) => {
      if (game.turn() === "w" && pv) setBestline(pv);
      if (game.turn() === "b" && bestMove) {
        game.move(bestMove); // Apply the computer's move
        setGamePosition(game.fen());
        checkEnd("b"); // Check if the game is over after the computer's move
      }
    });
  }, []);

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
      checkEnd("w"); // Check if the game is over after your move
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
      checkEnd("w"); // Check if the game is over after promotion
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

  const restartGame = () => {
    game.reset();
    setGamePosition(game.fen());
    setGameOver({ isOver: false, result: "" });
    setMoveFrom("");
    setMoveTo(null);
    setOptionSquares({});
    setBestline("");
    findBestMove();
  };

  return (
    <div className="w-[100vw] md:w-[500px]">
      {level === 1 && <h1 className="mb-5">Zvedavé dieťa</h1>}
      {level === 10 && <h1 className="mb-5">Rastúci stratég</h1>}
      {level === 20 && <h1 className="mb-5">Grand Master</h1>}
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
      {gameOver.isOver && (
        <GameOverScreen result={gameOver.result} onRestart={restartGame} />
      )}
    </div>
  );
};

const GameOverScreen = ({
  result,
  onRestart,
}: {
  result: string;
  onRestart: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-[#302E2B] p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Game Over</h2>
        <p className="text-xl mb-6">{result}</p>
        <div className="flex items-center gap-5">
          <button
            onClick={onRestart}
            className="bg-[#FF00F6] text-white px-4 py-2 rounded-lg hover:bg-[#d729d1] transition-all"
          >
            Restart Game
          </button>
          <Link href="/opponentSelect">
            <button className="bg-white text-black px-4 py-2 rounded-lg hover:bg-white/80 transition-all">
              Back to menu
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};