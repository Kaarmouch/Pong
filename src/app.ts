import { Game } from './game/game.js';

type PlayerType = "human" | "cpu" | null;
type GameMode = "1v1" | "2v2" | "CPU";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const menu = document.getElementById('menu')!;
const startBtn = document.getElementById('startBtn')!;
const modeSelect = document.getElementById('modeSelect') as HTMLSelectElement;
const customConfigDiv = document.getElementById('custom-config')!;

const playerSelects = [
  'player1', 'player2', 'player3', 'player4'
].map(id => document.getElementById(id) as HTMLSelectElement);

function getCustomPlayers(): PlayerType[] {
  return playerSelects.map(sel => {
    const val = sel.value;
    if (val === 'none') return null;
    return val as PlayerType;
  });
}

modeSelect.addEventListener('change', () => {
  customConfigDiv.style.display = modeSelect.value === '2v2' ? 'block' : 'none';
});

startBtn.addEventListener('click', () => {
  const mode = modeSelect.value as GameMode;

  let config: {
    mode: GameMode;
    playerSetup?: PlayerType[];
  } = { mode };

  if (mode === '2v2') {
    config.playerSetup = getCustomPlayers();
  }

  menu.style.display = 'none';
  canvas.style.display = 'block';

  const game = new Game(canvas, config);
  game.start();
});