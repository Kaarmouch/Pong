import { GameServer } from './game/game_server.js';

type PlayerType = "human" | "cpu" | null;
type GameMode = "1v1" | "2v2" | "CPU";

interface GameConfig {
  mode: GameMode;
  playerSetup?: PlayerType[];
}

// 🎨 Gestion du rendu du jeu
class GameRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Impossible d'obtenir le contexte 2D");
    this.ctx = ctx;
  }

  draw(state: ReturnType<GameServer["getGameState"]>) {
    // Efface l'écran
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Balle
    this.ctx.fillStyle = state.ball.color;
    this.ctx.fillRect(state.ball.x, state.ball.y, state.ball.width, state.ball.height);

    // Paddles
    state.paddles.forEach(p => {
      if (!p) return;
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(p.x, p.y, p.width, p.height);
    });

    // Score
    this.ctx.fillStyle = 'white';
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`${state.scores.A} - ${state.scores.B}`, this.canvas.width / 2 - 20, 30);
  }
}

// 🎮 Gestion du menu et lancement du jeu
class GameApp {
  private canvas: HTMLCanvasElement;
  private menu: HTMLElement;
  private startBtn: HTMLButtonElement;
  private modeSelect: HTMLSelectElement;
  private customConfigDiv: HTMLElement;
  private playerSelects: HTMLSelectElement[];

  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.menu = document.getElementById('menu')!;
    this.startBtn = document.getElementById('startBtn') as HTMLButtonElement;
    this.modeSelect = document.getElementById('modeSelect') as HTMLSelectElement;
    this.customConfigDiv = document.getElementById('custom-config')!;
    this.playerSelects = ['player1', 'player2', 'player3', 'player4']
      .map(id => document.getElementById(id) as HTMLSelectElement);

    this.initEvents();
  }

  private getCustomPlayers(): PlayerType[] {
    return this.playerSelects.map(sel => {
      const val = sel.value;
      return val === 'none' ? null : (val as PlayerType);
    });
  }

  private initEvents() {
    // Affiche les options 2v2 si besoin
    this.modeSelect.addEventListener('change', () => {
      this.customConfigDiv.style.display = this.modeSelect.value === '2v2' ? 'block' : 'none';
    });

    // Lance le jeu
    this.startBtn.addEventListener('click', () => {
      const mode = this.modeSelect.value as GameMode;
      const config: GameConfig = { mode };

      if (mode === '2v2') {
        config.playerSetup = this.getCustomPlayers();
      }

      this.launchLocalGame(config);
    });
  }

  private launchLocalGame(config: GameConfig) {
    this.menu.style.display = 'none';
    this.canvas.style.display = 'block';
    

    const game = new GameServer(this.canvas, config);
    const renderer = new GameRenderer(this.canvas);

    const loop = () => {
      game.update();
      renderer.draw(game.getGameState());
      requestAnimationFrame(loop);
    };

    loop();
  }
}

// 🚀 Lancement de l'app
new GameApp();



/*drawDashedLine(pattern: number[]) {
    this.ctx.strokeStyle = 'white';
    this.ctx.setLineDash(pattern);
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvas.width / 2, 0);
    this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
    this.ctx.stroke();
  }*/