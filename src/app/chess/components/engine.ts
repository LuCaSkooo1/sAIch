"use client"

export default class Engine {
    stockfish?: Worker;
    isReady?: boolean;
    onMessage?: (callback: (messageData: { bestMove?: string, uciMessage: string }) => void) => void;
  
    constructor() {
      if (typeof window !== "undefined") {
        // Only create the worker in the browser environment
        this.stockfish = new window.Worker("./stockfish.wasm.js", { type: "module" });  // Correct path to your stockfish worker
        this.isReady = false;
        this.onMessage = (callback) => {
          this.stockfish?.addEventListener("message", (e) => {
            callback(this.transformSFMessageData(e));
          });
        };
        this.init();
      }
    }
  
    private transformSFMessageData(e: { data: string }) {
      const uciMessage = e?.data ?? e;
  
      return {
        uciMessage,
        bestMove: uciMessage.match(/bestmove\s+(\S+)/)?.[1],
        ponder: uciMessage.match(/ponder\s+(\S+)/)?.[1],
        positionEvaluation: uciMessage.match(/cp\s+(\S+)/)?.[1],
        possibleMate: uciMessage.match(/mate\s+(\S+)/)?.[1],
        pv: uciMessage.match(/ pv\s+(.*)/)?.[1],
        depth: Number(uciMessage.match(/ depth\s+(\S+)/)?.[1]) ?? 0,
      };
    }
  
    init() {
      this.stockfish?.postMessage("uci");
      this.stockfish?.postMessage("isready");
      this.onMessage?.(({ uciMessage }) => {
        if (uciMessage === "readyok") {
          this.isReady = true;
        }
      });
    }
  
    onReady(callback: () => void) {
      this.onMessage?.(({ uciMessage }) => {
        if (uciMessage === "readyok") {
          callback();
        }
      });
    }
  
    evaluatePosition(fen: string, depth = 12) {
      if (depth > 24) depth = 24;
  
      this.stockfish?.postMessage(`position fen ${fen}`);
      this.stockfish?.postMessage(`go depth ${depth}`);
    }
  
    stop() {
      this.stockfish?.postMessage("stop");
    }
  
    terminate() {
      this.isReady = false;
      this.stockfish?.postMessage("quit");
    }
  }
  