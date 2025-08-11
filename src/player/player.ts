import { Paddle } from '../paddle/paddle.js';
import { Ball } from '../ball/ball.js';
import { PlayerInfo} from "../types/gameTypes.js";

export class Player {
  public id : number;
  public paddle: Paddle;
  public keys: { up: string, down: string };
  public input: Record<string, boolean>;

  constructor(paddle: Paddle, keys: { up: string, down: string }, id :number = 0) {
    this.paddle = paddle;
    this.keys = keys;
    this.input = { [keys.up]: false, [keys.down]: false };
    this.id = id;
  }

  public update(ball: Ball, canvasHeight: number) {
    if (this.input[this.keys.up] && this.paddle.y > 0) {
      this.paddle.moove(-1);
    } else if (this.input[this.keys.down] && (this.paddle.y + this.paddle.height < canvasHeight)) {
      this.paddle.moove(1);
    }
  }
}
