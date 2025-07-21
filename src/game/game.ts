// src/game/game.ts
import { Paddle } from '../paddle/paddle.js';
import { Ball } from '../ball/ball.js';
import { Player } from '../player/player.js';
import { CPU } from '../player/CPU.js';
import { Tracker } from '../tracker/tracker.js';
// import { Strudel } from '@strudel/web';

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  ball: Ball;
  player1: Player;
  player2: Player | CPU;
  scoreA : number = 0;
  scoreB : number = 0;
  running : boolean = true;
  private tracker = new Tracker();
  //pass cpu mode on app.ts
  constructor(canvas: HTMLCanvasElement, cpuMode = false) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Contexte 2D non trouvé.");
    this.ctx = ctx;

    const paddleWidth = canvas.width / 80;
    const paddleHeight = canvas.height / 12;
    const starterX = 5;
    const starterY = (canvas.height - paddleHeight) / 2;

    const paddle1 = new Paddle(starterX, starterY, paddleWidth, paddleHeight, 'white', 15);
    const paddle2 = new Paddle(
      canvas.width - starterX - paddleWidth,
      starterY,
      paddleWidth,
      paddleHeight,
      'white',
      15
    );

    this.player1 = new Player(paddle1, { up: 'z', down: 's' });

    this.player2 = cpuMode
      ? new CPU(paddle2)
      : new Player(paddle2, { up: 'ArrowUp', down: 'ArrowDown' });

    this.ball = new Ball(
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 80,
      canvas.width / 80,
      'white',
      'right'
    );

    this.ball.spawn();
  }

  drawDashedLine(pattern: number[]) {
    this.ctx.strokeStyle = 'white';
    this.ctx.setLineDash(pattern);
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvas.width / 2, 0);
    this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
    this.ctx.stroke();
  }
  isEnd() : boolean
  {
    if ((this.scoreA >= 11 ||this.scoreB >= 11) && 
      Math.abs(this.scoreA - this.scoreB) > 2
    )
    {
      if (this.scoreA > this.scoreB)
        this.tracker.setWinner("Player 1");
      else
        this.tracker.setWinner("Player 2");
      this.running = false ;
      return true;
    }
    return false
  }

  update() {
    this.player1.update(this.ball, this.canvas.height);
    this.player2.update(this.ball, this.canvas.height);

    this.ball.update();
    this.ball.colision(this.player1.paddle, this.player2.paddle, this.canvas.height, this.tracker);

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

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.font = '48px Arial';

    this.drawDashedLine([10, 10]);
    this.ctx.fillText(this.scoreA.toString(), this.canvas.width / 4, 90);
    this.ctx.fillText(this.scoreB.toString(), (this.canvas.width * 3) / 4, 90);

    this.player1.paddle.draw(this.ctx);
    this.player2.paddle.draw(this.ctx);
    this.ball.draw(this.ctx);
  }

  loop = () => {
    this.update();
    this.draw();
    if (this.running)
      requestAnimationFrame(this.loop);
    else
      this.endGame();
};
  endScreen(stats :{ winner: string | null;
  totalExchanges: number;
  maxRally: number;})
    : void {
  const ctx = this.ctx;

  // Overlay sombre
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

  // Texte
  ctx.fillStyle = 'white';
  ctx.font = '28px Arial';
  ctx.textAlign = 'center';

  const centerX = this.canvas.width / 2;
  let y = this.canvas.height / 2 - 60;

  ctx.fillText(`🏆 Gagnant : ${stats.winner}`, centerX, y);
  y += 40;
  ctx.fillText(`Total échanges : ${stats.totalExchanges}`, centerX, y);
  y += 30;
  ctx.fillText(`Rallye max : ${stats.maxRally}`, centerX, y);
  
}

  endGame()
  {
    const stats = this.tracker.getStats();
    this.endScreen(stats);
  }

  start() {
    this.loop();
  }
}
