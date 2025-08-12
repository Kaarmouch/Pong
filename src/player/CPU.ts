import { Paddle } from '../paddle/paddle.js';
import { Ball } from '../ball/ball.js';
import { PlayerInfo} from "../types/gameTypes.js";

export class CPU {
  public paddle: Paddle;
  public gameMode: string;
  private limitTop: number;
  private limitBot: number;

  constructor(paddle: Paddle, mode: string, indexPaddle: number, canvasHeight: number) {
    this.paddle = paddle;
    this.gameMode = mode;
    if (mode == '2v2')
    {
      console.log("2v2 detected");
      
      if (indexPaddle == 0 || indexPaddle == 3){
        this.limitTop = 0;
        this.limitBot = (canvasHeight/2)-paddle.height;
      } 
      else 
      {
        this.limitTop = canvasHeight/2
        this.limitBot = canvasHeight - paddle.height;
      }
    } else {
      this.limitTop = 0
      this.limitBot = canvasHeight - paddle.height;
    }
  }

  public predictBall(ball: Ball, canvasHeight: number) : number
  {
    if ((ball.vx > 0) === (this.paddle.x > ball.x))
    {
      const distX = this.paddle.x - (ball.x + ball.width /2);
      const timeImpact = distX / ball.vx;
      const projectedY = (ball.y + ball.height / 2) + ball.vy * timeImpact;
      let foldedY = projectedY % (2*canvasHeight); // cycle comme une onde
      if (foldedY < 0)
        foldedY *= -1;
      if (foldedY <= canvasHeight)
        return foldedY;
      else
        return (canvasHeight*2) - foldedY;
    }
    return -1;
  }
 
  public update(ball: Ball, canvasHeight: number) {
    const YBallImpact = this.predictBall(ball, canvasHeight);
    if (YBallImpact != -1)
    {
      const paddleCenter = this.paddle.y + this.paddle.height / 2;
      const ballCenter = YBallImpact + ball.height / 2;
      const speed = 7;
      if (ballCenter < this.paddle.y) {
        this.paddle.y -= speed;
      } else if (ballCenter > paddleCenter + 10) {
        this.paddle.y += speed;
      }
    }
      // Clamp
      this.paddle.y = Math.max(this.limitTop, Math.min(this.limitBot, this.paddle.y));
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