import { GameLogic } from './game/game_logic.js';
class GameRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            throw new Error("Impossible d'obtenir le contexte 2D");
        this.ctx = ctx;
        this.startTime = performance.now();
    }
    drawDashedLine(pattern) {
        this.ctx.strokeStyle = 'white';
        this.ctx.setLineDash(pattern);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
    }
    endScreen(state) {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '28px Arial';
        ctx.textAlign = 'center';
        const centerX = this.canvas.width / 2;
        let y = this.canvas.height / 2 - 60;
        ctx.fillText(`Gagnant : ${state.traker.winner}`, centerX, y);
        y += 40;
        ctx.fillText(`Total échanges : ${state.traker.totalExchanges}`, centerX, y);
        y += 30;
        ctx.fillText(`Rallye max : ${state.traker.maxRally}`, centerX, y);
    }
    draw(state) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawDashedLine([10, 10]);
        this.ctx.fillStyle = state.ball.color;
        this.ctx.fillRect(state.ball.x, state.ball.y, state.ball.width, state.ball.height);
        state.paddles.forEach(p => {
            if (!p)
                return;
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(p.x, p.y, p.width, p.height);
        });
        const elapsed = (performance.now() - this.startTime) / 1000;
        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "white";
        if (elapsed < 3) {
            let x;
            state.paddles.forEach((paddle, index) => {
                if (!paddle)
                    return;
                if (index % 2 == 0) {
                    this.ctx.textAlign = "left";
                    x = paddle.x;
                }
                else {
                    this.ctx.textAlign = "right";
                    x = paddle.x + paddle.width;
                }
                this.ctx.fillText(paddle.name, x, paddle.y - 15);
            });
        }
        this.ctx.font = "30px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(`${state.scores.A}    ${state.scores.B}`, this.canvas.width / 2, 40);
    }
}
class GameApp {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.menu = document.getElementById('menu-game-config');
        this.startBtn = document.getElementById('startBtn');
        this.modeSelect = document.getElementById('modeSelect');
        this.config2v2 = document.getElementById('custom-config_2vs2');
        this.config1v1 = document.getElementById('custom-config_1vs1');
        // récupère tous les selects par mode
        this.playerSelects2v2 = ['player1', 'player2', 'player3', 'player4']
            .map(id => document.getElementById(id));
        this.playerSelects1v1 = ['player1_1v1', 'player2_1v1']
            .map(id => document.getElementById(id));
        this.initEvents();
    }
    getCustomPlayers(mode) {
        const selects = mode === '2v2' ? this.playerSelects2v2 : this.playerSelects1v1;
        return selects.map((sel, index) => ({
            type: sel.value,
            playerId: index + 1
        }));
    }
    initEvents() {
        // Switch entre configs selon mode
        this.modeSelect.addEventListener('change', () => {
            const mode = this.modeSelect.value;
            if (mode === '2v2') {
                this.config2v2.style.display = 'block';
                this.config1v1.style.display = 'none';
            }
            else {
                this.config2v2.style.display = 'none';
                this.config1v1.style.display = 'block';
            }
        });
        // Lancer la partie
        this.startBtn.addEventListener('click', () => {
            const mode = this.modeSelect.value;
            const config = {
                mode,
                playerSetup: this.getCustomPlayers(mode)
            };
            this.launchLocalGame(config);
        });
    }
    launchLocalGame(config) {
        this.menu.style.display = 'none';
        this.canvas.style.display = 'block';
        const game = new GameLogic(this.canvas.width, this.canvas.height, config);
        const renderer = new GameRenderer(this.canvas);
        window.addEventListener('keydown', (e) => {
            game.setPlayerInput(e.key, true);
        });
        window.addEventListener('keyup', (e) => {
            game.setPlayerInput(e.key, false);
        });
        const loop = () => {
            game.update();
            let state = game.getGameState();
            renderer.draw(state);
            if (state.running)
                requestAnimationFrame(loop);
            else
                renderer.endScreen(state);
        };
        loop();
    }
}
new GameApp();
