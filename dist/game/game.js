// src/game/game.ts
import { Paddle } from '../paddle/paddle.js';
import { Ball } from '../ball/ball.js';
import { Player } from '../player/player.js';
import { CPU } from '../player/CPU.js';
// import { Strudel } from '@strudel/web';
export class Game {
    constructor(canvas, cpuMode = false) {
        this.scoreA = 0;
        this.scoreB = 0;
        this.loop = () => {
            console.log("game loop tick"); // DEBUG
            this.update();
            this.draw();
            requestAnimationFrame(this.loop);
        };
        this.canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            throw new Error("Contexte 2D non trouvé.");
        this.ctx = ctx;
        const paddleWidth = canvas.width / 80;
        const paddleHeight = canvas.height / 12;
        const starterX = 5;
        const starterY = (canvas.height - paddleHeight) / 2;
        const paddle1 = new Paddle(starterX, starterY, paddleWidth, paddleHeight, 'white', 15);
        const paddle2 = new Paddle(canvas.width - starterX - paddleWidth, starterY, paddleWidth, paddleHeight, 'white', 15);
        this.player1 = new Player(paddle1, { up: 'z', down: 's' });
        // Toggle CPU mode
        this.player2 = cpuMode
            ? new CPU(paddle2)
            : new Player(paddle2, { up: 'ArrowUp', down: 'ArrowDown' });
        this.ball = new Ball(canvas.width / 2, canvas.height / 2, canvas.width / 80, canvas.width / 80, 'white', 'right');
        this.ball.spawn();
    }
    drawDashedLine(pattern) {
        this.ctx.strokeStyle = 'white';
        this.ctx.setLineDash(pattern);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
    }
    update() {
        this.player1.update(this.ball, this.canvas.height);
        this.player2.update(this.ball, this.canvas.height);
        this.ball.update();
        this.ball.colision(this.player1.paddle, this.player2.paddle, this.canvas.height);
        if (this.ball.goal(this.canvas.width)) {
            if (this.ball.x <= 0)
                this.scoreB++;
            else
                this.scoreA++;
            this.ball.x = this.canvas.width / 2;
            this.ball.y = this.canvas.height / 2;
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
    start() {
        this.loop();
    }
}
