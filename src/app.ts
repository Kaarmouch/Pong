import { Game } from './game/game.js';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const menu = document.getElementById('menu')!;
const startJCJBtn = document.getElementById('JCJ')!;
const startCPUBtn = document.getElementById('CPU')!;


function launchGame(mode: boolean)
{
  menu.style.display = 'none';
  canvas.style.display = 'block';
  const game = new Game(canvas, mode);
  game.start();
};

startJCJBtn.addEventListener('click', () => {
  launchGame(false);
});

startCPUBtn.addEventListener('click', () => {
  launchGame(true);
});