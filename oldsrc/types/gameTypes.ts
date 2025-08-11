

export interface PlayerInfo {
  type : "human" | "cpu" | null;
  playerId: number | null;
}

type gameMode = "1v1" | "2v2" | "CPU" | "tournament";

export interface gameConfig {
  gameId: number;
  mode: gameMode;
  playerSetup: PlayerInfo[];
}
export interface GameState {
  ball: {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  };
  paddles: ({
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  } | null)[];
  scores: {
    A: number;
    B: number;
  };
  running: boolean;
}

// ===  Input utilisateur ===
export interface PlayerInput {
  playerId: string;
  direction: 'up' | 'down' | 'stop';
}

// ===  Message WebSocket entrant/sortant ===
export interface ServerMessage {
  type: 'gameState' | 'matchFound' | 'info' | 'error';
  payload: any;
}
