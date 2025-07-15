import { Game } from './game/game.js';
const canvas = document.getElementById('canvas');
const menu = document.getElementById('menu');
const startBtn = document.getElementById('JCJ');
startBtn.addEventListener('click', () => {
    console.log("game started"); // DEBUG
    menu.style.display = 'none';
    canvas.style.display = 'block';
    const game = new Game(canvas);
    game.start();
});
