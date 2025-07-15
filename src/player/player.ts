import { Paddle } from '../paddle/paddle';
import { Ball } from '../ball/ball';

export class Player {
  public paddle: Paddle;
  private keys: { up: string, down: string };
  private input: Record<string, boolean>;

  constructor(paddle: Paddle, keys: { up: string, down: string }) {
    this.paddle = paddle;
    this.keys = keys;
    this.input = { [keys.up]: false, [keys.down]: false };

    window.addEventListener('keydown', (e) => {
      if (e.key in this.input) this.input[e.key] = true;
    });

    window.addEventListener('keyup', (e) => {
      if (e.key in this.input) this.input[e.key] = false;
    });
  }

  public update(ball: Ball, canvasHeight: number) {
    const speed = 8;

    if (this.input[this.keys.up] && this.paddle.y > 0) {
      this.paddle.moove(-this.paddle.speed);
    } else if (this.input[this.keys.down] && (this.paddle.y + this.paddle.height < canvasHeight)) {
      this.paddle.moove(this.paddle.speed);
    }
  }
}
