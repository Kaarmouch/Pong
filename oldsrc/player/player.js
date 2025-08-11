export class Player {
    constructor(paddle, keys, id) {
        this.paddle = paddle;
        this.keys = keys;
        this.input = { [keys.up]: false, [keys.down]: false };
        this.id = id;
    }
    serialize() {
        return {
            x: this.paddle.x,
            y: this.paddle.y,
            width: this.paddle.width,
            height: this.paddle.height,
            type: "human",
            playerId: this.id,
        };
    }
    update(ball, canvasHeight) {
        if (this.input[this.keys.up] && this.paddle.y > 0) {
            this.paddle.moove(-1);
        }
        else if (this.input[this.keys.down] && (this.paddle.y + this.paddle.height < canvasHeight)) {
            this.paddle.moove(1);
        }
    }
}
