export class CPU {
    constructor(paddle) {
        this.lastUpdateTime = 0;
        this.paddle = paddle;
    }
    predictBall(ball, canvasHeight) {
        if ((ball.vx > 0) === (this.paddle.x > ball.x)) {
            const distX = this.paddle.x - (ball.x + ball.width / 2);
            const timeImpact = distX / ball.vx;
            const projectedY = (ball.y + ball.height / 2) + ball.vy * timeImpact;
            let foldedY = projectedY % (2 * canvasHeight); // cycle comme une onde
            if (foldedY < 0)
                foldedY *= -1;
            if (foldedY <= canvasHeight)
                return foldedY;
            else
                return (canvasHeight * 2) - foldedY;
        }
        return -1;
    }
    serialize() {
        return {
            x: this.paddle.x,
            y: this.paddle.y,
            width: this.paddle.width,
            height: this.paddle.height,
            type: "cpu",
            playerId: -1,
        };
    }
    update(ball, canvasHeight) {
        const YBallImpact = this.predictBall(ball, canvasHeight);
        if (YBallImpact != -1) {
            const paddleCenter = this.paddle.y + this.paddle.height / 2;
            const ballCenter = YBallImpact + ball.height / 2;
            const speed = 7;
            if (ballCenter < this.paddle.y) {
                this.paddle.y -= speed;
            }
            else if (ballCenter > paddleCenter + 10) {
                this.paddle.y += speed;
            }
            // Clamp
            this.paddle.y = Math.max(0, Math.min(canvasHeight - this.paddle.height, this.paddle.y));
        }
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
