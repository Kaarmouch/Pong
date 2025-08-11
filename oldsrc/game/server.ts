import WebSocket from 'ws';
import { GameServer } from './game_server';
import { v4 as uuidv4 } from 'uuid';

interface Player {
  id: string;
  socket: WebSocket;
}


export class ServerGameManager {
  private waitingPlayers: Player[] = [];
  private games: Map<string, GameServer> = new Map();

  constructor() {
    setInterval(() => this.tick(), 1000 / 60); // 60 FPS
  }

  addPlayerToQueue(socket: WebSocket) {
    //const id = uuidv4();
    const player: Player = { idJoueur, socket };
    this.waitingPlayers.push(player);

    socket.send(JSON.stringify({ type: 'info', message: 'En attente d’un adversaire...', id }));

    this.matchPlayers();
  }

  private matchPlayers() {
    while (this.waitingPlayers.length >= 2) {
      const [p1, p2] = [this.waitingPlayers.shift()!, this.waitingPlayers.shift()!];

      const gameId = uuidv4();
      const game = new GameServer(gameId, [p1, p2]);

      this.games.set(gameId, game);
      game.start();

      console.log(`🆕 Partie créée : ${gameId}`);
    }
  }

  handleInput(playerId: string, input: any) {
    for (const game of this.games.values()) {
      if (game.hasPlayer(playerId)) {
        game.handleInput(playerId, input);
        break;
      }
    }
  }

  removePlayer(playerId: string) {
    for (const [gameId, game] of this.games.entries()) {
      if (game.hasPlayer(playerId)) {
        game.terminate();
        this.games.delete(gameId);
        console.log(` Partie arrêtée : ${gameId}`);
        break;
      }
    }

    // Supprime aussi s'il était en attente
    this.waitingPlayers = this.waitingPlayers.filter(p => p.id !== playerId);
  }

  private tick() {
    for (const game of this.games.values()) {
      game.update();
    }
  }
}
