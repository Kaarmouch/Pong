import { Paddle } from '../paddle/paddle.js';
import { Ball } from '../ball/ball.js';

export class CPU {
  public paddle: Paddle;
  private lastUpdateTime: number = 0;

  constructor(paddle: Paddle) {
    this.paddle = paddle;
  }

  public predictBall(ball: Ball, canvasHeight: number) : number;
  {
    if ()

  }


  public update(ball: Ball, canvasHeight: number) {
    const currentTime = Date.now();

    const paddleCenter = this.paddle.y + this.paddle.height / 2;
    const ballCenter = ball.y + ball.height / 2;
    const speed = 7;

    if (ballCenter < this.paddle.y) {
      this.paddle.y -= speed;
    } else if (ballCenter > paddleCenter + 10) {
      this.paddle.y += speed;
    }

    
    // Clamp
    this.paddle.y = Math.max(0, Math.min(canvasHeight - this.paddle.height, this.paddle.y));
  }

}
/*function simulatedKey(key: string, type: 'keydown' | 'keyup') {
  const event = new KeyboardEvent(type, {
    key: key,
    code: key,
    bubbles: true,
  });
  window.dispatchEvent(event);
}*/