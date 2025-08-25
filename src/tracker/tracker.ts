import { Player } from "./player";
import { CPU } from "./CPU";

export class Tracker {
  private exchanges: number = 0;
  private totalExchanges : number = 0
  private maxRally: number = 0;
  private winner: Player | CPU | null | string = null;

  recordHit() : void 
  {
    this.exchanges++;
    this.totalExchanges++;
    if (this.exchanges > this.maxRally)
      this.maxRally = this.exchanges;
  }

  setWinner(winner: Player |CPU |null |string) : void
  {
    this.winner = winner; 
  }
  resetExchange () : void
  {
    this.exchanges = 0;
  }

  getStats() :{ winner: Player | CPU | null | string;
  totalExchanges: number;
  maxRally: number;}
  { 
    return {
      winner: this.winner,
      totalExchanges: this.totalExchanges, 
      maxRally: this.maxRally,
    };
  }
}