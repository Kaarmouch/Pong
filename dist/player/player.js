export class Player {
    constructor(paddle, keys) {
        this.paddle = paddle;
        this.keys = keys;
        this.input = { [keys.up]: false, [keys.down]: false };
        window.addEventListener('keydown', (e) => {
            if (e.key in this.input)
                this.input[e.key] = true;
        });
        window.addEventListener('keyup', (e) => {
            if (e.key in this.input)
                this.input[e.key] = false;
        });
    }
    update(ball, canvasHeight) {
        const speed = 8;
        if (this.input[this.keys.up] && this.paddle.y > 0) {
            this.paddle.moove(-this.paddle.speed);
        }
        else if (this.input[this.keys.down] && (this.paddle.y + this.paddle.height < canvasHeight)) {
            this.paddle.moove(this.paddle.speed);
        }
    }
}
