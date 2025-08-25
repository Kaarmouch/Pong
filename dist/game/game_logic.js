// src/game/game.ts
import { Paddle } from '../paddle/paddle.js';
import { Ball } from '../ball/ball.js';
import { Player } from '../player/player.js';
import { CPU } from '../player/CPU.js';
import { Tracker } from '../tracker/tracker.js';
// import { Strudel } from '@strudel/web';
export class GameLogic {
    constructor(W, H, conf) {
        this.players = [];
        this.paddles = [];
        this.scoreA = 0;
        this.scoreB = 0;
        this.running = true;
        this.config = conf;
        this.canvasH = H;
        this.canvasW = W;
        this.ball = new Ball((W / 2) - (W / 40), H / 2, W / 80, W / 80, 'white', 'right');
        this.initPlayers();
        this.tracker = new Tracker();
        setTimeout(() => {
            this.ball.spawn();
        }, 2000);
        this.ball.stop();
    }
    initPlayers() {
        const paddleWidth = this.canvasW / 80;
        const paddleHeight = this.canvasH / 20;
        const margin = 5;
        const spacing = 30;
        const mid = (this.canvasH) / 2;
        //team : P1 et P3 // P2 et P4
        const positions = [
            { x: margin, y: (mid - mid / 2) + paddleHeight / 2 },
            { x: this.canvasW - margin - paddleWidth, y: (mid + mid / 2) + paddleHeight / 2 },
            { x: margin * 2 + paddleWidth, y: (mid + mid / 2) + paddleHeight / 2 },
            { x: this.canvasW - (margin * 4 + paddleWidth), y: (mid - mid / 2) + paddleHeight / 2 } //P4
        ];
        const controls = [
            { up: 'z', down: 's' },
            { up: 'ArrowUp', down: 'ArrowDown' },
            { up: 'e', down: 'd' },
            { up: 'i', down: 'k' }
        ];
        for (let i = 0; i < 4; i++) {
            if (!this.config.playerSetup[i]) {
                this.players.push(null);
                this.paddles.push(null);
                continue;
            }
            const paddle = new Paddle(positions[i].x, positions[i].y, paddleWidth, paddleHeight, 'white', 15);
            this.paddles.push(paddle);
            this.players.push(this.config.playerSetup[i].type == "human"
                ? new Player(paddle, controls[i])
                : new CPU(paddle, this.config.mode, i, this.canvasH, controls[i]));
        }
    }
    isEnd() {
        if ((this.scoreA >= 11 || this.scoreB >= 11) &&
            Math.abs(this.scoreA - this.scoreB) > 2) {
            if (this.scoreA > this.scoreB)
                this.tracker.setWinner("Team 1");
            else
                this.tracker.setWinner("Team 2");
            this.running = false;
            return true;
        }
        return false;
    }
    setPlayerInput(key, isPressed) {
        for (const player of this.players) {
            if (!player)
                continue;
            if (!('keys' in player))
                continue; // veski les "cpu"
            if (player.keys.up === key) {
                player.input[player.keys.up] = isPressed;
            }
            if (player.keys.down === key) {
                player.input[player.keys.down] = isPressed;
            }
        }
    }
    ;
    update() {
        this.players.forEach((player, i) => {
            if (player && this.paddles[i]) {
                player.update(this.ball, this.canvasH);
            }
        });
        const activePaddles = this.paddles.filter(p => p !== null);
        this.ball.colisionMultiple(activePaddles, this.canvasH, this.tracker);
        this.ball.update();
        if (this.ball.goal(this.canvasW)) {
            if (this.ball.x <= 0)
                this.scoreB++;
            else
                this.scoreA++;
            this.tracker.resetEchange();
            if (this.isEnd() == true)
                return;
            this.ball.x = (this.canvasW / 2) - (this.ball.width / 2);
            if ((this.scoreA + this.scoreB) % 2 == 0)
                this.ball.y = this.canvasH - this.canvasH / 4;
            else
                this.ball.y = this.canvasH / 4;
            this.ball.spawn();
        }
    }
    getGameState() {
        return {
            ball: {
                x: this.ball.x,
                y: this.ball.y,
                width: this.ball.width,
                height: this.ball.height,
                color: this.ball.color
            },
            paddles: this.players.map(p => p ? {
                name: p.name,
                x: p.paddle.x,
                y: p.paddle.y,
                width: p.paddle.width,
                height: p.paddle.height,
                color: p.paddle.color
            } : null),
            scores: {
                A: this.scoreA,
                B: this.scoreB
            },
            running: this.running,
            traker: this.tracker.getStats(),
        };
    }
    ;
}
