import { Game } from './game/game.js';
const canvas = document.getElementById('canvas');
const menu = document.getElementById('menu');
const startBtn = document.getElementById('startBtn');
const modeSelect = document.getElementById('modeSelect');
const customConfigDiv = document.getElementById('custom-config');
const playerSelects = [
    'player1', 'player2', 'player3', 'player4'
].map(id => document.getElementById(id));
function getCustomPlayers() {
    return playerSelects.map(sel => {
        const val = sel.value;
        if (val === 'none')
            return null;
        return val;
    });
}
/*function resizeCanvasToWindow(canvas: HTMLCanvasElement) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}*/
modeSelect.addEventListener('change', () => {
    customConfigDiv.style.display = modeSelect.value === '2v2' ? 'block' : 'none';
});
startBtn.addEventListener('click', () => {
    const mode = modeSelect.value;
    let config = { mode };
    if (mode === '2v2') {
        config.playerSetup = getCustomPlayers();
    }
    menu.style.display = 'none';
    canvas.style.display = 'block';
    const game = new Game(canvas, config);
    game.start();
});
/*drawDashedLine(pattern: number[]) {
    this.ctx.strokeStyle = 'white';
    this.ctx.setLineDash(pattern);
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvas.width / 2, 0);
    this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
    this.ctx.stroke();
  }*/ 
