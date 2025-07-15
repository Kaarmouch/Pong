import { Paddle } from '../paddle/paddle.js';
import { Ball } from '../ball/ball.js';

export class CPU {
  public paddle: Paddle;

  constructor(paddle: Paddle) {
    this.paddle = paddle;
  }

  public update(ball: Ball, canvasHeight: number) {
    const paddleCenter = this.paddle.y + this.paddle.height / 2;
    const ballCenter = ball.y + ball.height / 2;
    const speed = 5;

    if (ballCenter < this.paddle.y) {
      this.paddle.y -= speed;
    } else if (ballCenter > paddleCenter + 10) {
      this.paddle.y += speed;
    }

    // Clamp
    this.paddle.y = Math.max(0, Math.min(canvasHeight - this.paddle.height, this.paddle.y));
  }
}
