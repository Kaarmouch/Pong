import { Paddle } from "../paddle/paddle";
import { Tracker } from "../tracker/tracker";

export class Ball {
    public vx: number = 0;
    public vy: number = 0;
    public speed: number = 10;
    
    public live: boolean = true;

    constructor (
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public color: string,
    public serviceTo : string, 
    ) {} 
    spawn(): void
    {
        let angle: number;

        if (!this.live)
        {   
            if (this.serviceTo === 'rigth') {
                angle = randomAngleRad(11 * Math.PI / 6, Math.PI / 6);
            } else {
                angle = randomAngleRad(5 * Math.PI / 6, 7 * Math.PI / 6);
            }
            this.live = true;
        }
        else
                angle = Math.random() * Math.PI * 2;
        this.launch(angle);
    }

    launch(angle: number)
    {
        this.vx = Math.cos(angle)*this.speed;
        this.vy = Math.sin(angle)*this.speed;
    }

    colisionMultiple(paddles: Paddle[], canvasHeight: number, tracker: Tracker) {
         if (this.y + this.vy <= 0 || this.y + this.height + this.vy >= canvasHeight)
        {
            this.vy *= -1;
            console.log("wall");
            
        }
        for (const paddle of paddles) {
            this.colision(paddle, canvasHeight, tracker); 
        }
    }
    colision(paddle: Paddle, canvasHeight: number, tracker: Tracker): void
    {
       
        if (paddle.x < this.x)
        {
            if (this.x <= paddle.x +paddle.width && 
                this.y <= paddle.y +paddle.height &&
                this.y + this.height >= paddle.y)
            {
                paddle.interaction(this);
                tracker.recordHit();
            }
        }
        else
        {
            if (this.x +this.width >= paddle.x  && 
            this.y <= paddle.y + paddle.height &&
            this.y + this.height>= paddle.y)
            {
                paddle.interaction(this);
                tracker.recordHit();
            }
        }
    }

    goal(canvasWidth: number): boolean
    {
        if ((this.x <= 0 )|| (this.x >= (canvasWidth - this.width)))
        {
            if (this.x <= 0)
               this.serviceTo = 'left';
            else
                this.serviceTo = 'rigth';
            this.live = false;
            return true;
        }
        return false;
    }   

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y,this.width, this.height);
    }

}
function randomAngleRad(minRad: number, maxRad: number): number {
  if (minRad < maxRad) {
    return Math.random() * (maxRad - minRad) + minRad;
  } else {
    const range = 2 * Math.PI - minRad + maxRad;
    const rand = Math.random() * range;
    return (minRad + rand) % (2 * Math.PI);
  }
}