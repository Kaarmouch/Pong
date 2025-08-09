// src/game/game.ts
import { Paddle } from '../paddle/paddle.js';
import { Ball } from '../ball/ball.js';
import { Player } from '../player/player.js';
import { CPU } from '../player/CPU.js';
import type { GameState, PlayerInfo } from '../types/gameTypes.js'
import type { gameConfig } from '../types/gameTypes.js';
import { Tracker } from '../tracker/tracker.js';
// import { Strudel } from '@strudel/web';





export class GameServer {
  canvas: HTMLCanvasElement;
  ball: Ball;
  players: (Player | CPU | null)[] = [];
  paddles: (Paddle | null)[] = [];
  scoreA : number = 0;
  scoreB : number = 0;
  running : boolean = true;
  private tracker = new Tracker();
  private config: gameConfig
  //pass cpu mode on app.ts
  constructor(canvas: HTMLCanvasElement, conf: gameConfig) {
    this.canvas = canvas;
    this.config = conf;  
    this.ball = new Ball(
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 80,
      canvas.width / 80,
      'white',
      'right'
    );
    this.initPlayers();
    this.ball.spawn();
  }

    private initPlayers() {
    const paddleWidth = this.canvas.width / 80;
    const paddleHeight = this.canvas.height / 12;
    const margin = 5;
    const spacing = 30;
    const y = (this.canvas.height - paddleHeight) / 2;

    const positions = [
      { x: margin, y },
      { x: this.canvas.width - margin - paddleWidth, y },
      { x: margin * 2 + paddleWidth, y: y + spacing },
      { x: this.canvas.width - (margin * 4  + paddleWidth), y: y + spacing }
    ];

    const controls = [
      { up: 'z', down: 's' },
      { up: 'ArrowUp', down: 'ArrowDown' },
      { up: 'e', down: 'd' },
      { up: 'i', down: 'k' }
    ];

let players: PlayerInfo[] = [];

switch (this.config.mode) {
  case "1v1":
    players = [
      { type: "human", playerId: 0 },
      { type: "human", playerId: 1 }
    ];
    break;

  case "CPU":
    players = [
      { type: "human", playerId: 0 },
      { type: "cpu", playerId: 1 }
    ];
    break;

  case "2v2":
    players = this.config.playerSetup.length
      ? this.config.playerSetup
      : [
          { type: "cpu", playerId: 0 },
          { type: "cpu", playerId: 1 },
          { type: "cpu", playerId: 2 },
          { type: "cpu", playerId: 3 }
        ];
    break;

  default:
    players = [
      { type: "human", playerId: 0 },
      { type: "human", playerId: 1 }
    ];
  }
  for (let i = 0; i < 4; i++) {
    const playerInfo = players[i] ?? { type: null, playerId: null };

    if (playerInfo.type === null) {
      this.players.push(null);
      this.paddles.push(null);
      continue;
    }

    const paddle = new Paddle(
      positions[i].x,
      positions[i].y,
      paddleWidth,
      paddleHeight,
      'white',
      15
    );

    this.paddles.push(paddle);
    this.players.push(
      playerInfo.type === "human"
      ? new Player(paddle, controls[i])
      : new CPU(paddle)
    );
  }
}

  isEnd() : boolean
  {
    if ((this.scoreA >= 11 ||this.scoreB >= 11) && 
      Math.abs(this.scoreA - this.scoreB) > 2
    )
    {
      if (this.scoreA > this.scoreB)
        this.tracker.setWinner("Team 1");
      else
        this.tracker.setWinner("Team 2");
      this.running = false ;
      return true;
    }
    return false
  }

  update() {
    this.players.forEach((player, i) => {
    if (player && this.paddles[i]) {
      player.update(this.ball, this.canvas.height);
    }
    })
    
    const activePaddles = this.paddles.filter(p => p !== null) as Paddle[];
    this.ball.colisionMultiple(activePaddles, this.canvas.height, this.tracker);
    this.ball.update();
    if (this.ball.goal(this.canvas.width)) {
      if (this.ball.x <= 0) this.scoreB++;
      else this.scoreA++;
      this.tracker.resetExchange();
      if (this.isEnd() == true)
        return; 
      this.ball.x = this.canvas.width / 2;
      if ((this.scoreA + this.scoreB)%2 == 0)
        this.ball.y = this.canvas.height - this.canvas.height / 4;
      else
        this.ball.y = this.canvas.height / 4;
      this.ball.spawn();
    }
  }

  getGameState(): GameState {
  return {
    ball: {
      x: this.ball.x,
      y: this.ball.y,
      width: this.ball.width,
      height: this.ball.height,
      color: this.ball.color
    },
    paddles: this.paddles.map(p => p ? {
      x: p.x,
      y: p.y,
      width: p.width,
      height: p.height,
      color: p.color
    } : null),
    scores: {
      A: this.scoreA,
      B: this.scoreB
    },
    running: this.running
  };
}

  endGame()
  {
    const stats = this.tracker.getStats();
    //this.endScreen(stats);
    const menu = document.getElementById("menu");
    if (menu)
      menu.style.display = "block"; // reafficher menu de fin 
  }

}
