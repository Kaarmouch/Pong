import { GameLogic } from "./game_logic.js";
import type { GameState, PlayerInfo } from './types.js'
import type { gameConfig } from './types.js';
import { Tracker } from './tracker.js';
import { Player } from './player.js';
import { CPU } from './CPU.js';

export interface contender{
    id: number
    name: string;
}

export interface buildTournament {
    players: contender[];
    Online: boolean;
}

export interface infoMatch {
    tracked: Tracker[]
}

export class Tournament {
    private canvasH: number;
    private canvasW: number;
    private matchs: GameLogic[] = [];
    private confs: gameConfig[] = [];
    private currentMatchId: number =0;
    private winner: contender[] = [];

    constructor(canvasW: number, canvasH:number, info: buildTournament)
    {
        this.canvasH = canvasH;
        this.canvasW = canvasW;
        this.buildConfs(info.players);
        this.startTour();
        if(!info.Online)
            this.playLocal();
    }
     
    
    private startTour() 
    {
        this.matchs = this.confs.map(conf =>
            new GameLogic(this.canvasW, this.canvasH, conf)
        );
        this.currentMatchId = 0;
        this.winner = [];
    }

    private buildConfs(list: contender[])
    {
        this.confs = [];
        for (let i = 0; i < list.length; i += 2) {
            if (i + 1 < list.length) {
                this.confs.push({
                    playerSetup: [
                        {  type: "human", playerId: list[i].id, name: list[i].name},   // joueur A
                        { playerId: list[i + 1].id, type: "human", name: list[i].name }, // joueur B
                    ],
                    mode: "1v1" 
                });
            }
        }
    }

    public playLocal(): GameState
    {
        
        this.matchs[this.currentMatchId].update();
        let info = this.matchs[this.currentMatchId].getGameState();

        if (info.running == false) 
        {
            let win = info.tracker.winner
            if (win)
                this.appendWinner(win);
            this.currentMatchId++;
        
        if (this.currentMatchId >= this.matchs.length) {
                if (this.winner.length > 1) {
                    // préparer le tour suivant
                    this.buildConfs(this.winner);
                    this.startTour();
                }
            }
        }
        return info;
    }
    public appendWinner(winner: Player| CPU |string)
    {
        if(winner != null)
            this.winner.push();
    }
    public isFinished(): boolean {return (this.winner.length == 1);}
}