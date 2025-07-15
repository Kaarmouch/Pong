export class Ball {
    constructor(x, y, width, height, color, serviceTo) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.serviceTo = serviceTo;
        this.vx = 0;
        this.vy = 0;
        this.speed = 13;
        this.live = true;
    }
    spawn() {
        let angle;
        if (!this.live) {
            if (this.serviceTo === 'rigth') {
                angle = randomAngleRad(11 * Math.PI / 6, Math.PI / 6);
            }
            else {
                angle = randomAngleRad(5 * Math.PI / 6, 7 * Math.PI / 6);
            }
            this.live = true;
        }
        else
            angle = Math.random() * Math.PI * 2;
        this.launch(angle);
    }
    launch(angle) {
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
    }
    colision(P1, P2, canvasHeight) {
        if (this.y <= 0 || this.y + this.height >= canvasHeight)
            this.vy *= -1;
        if (this.x <= P1.x + P1.width &&
            this.y <= P1.y + P1.height &&
            this.y + this.height >= P1.y) {
            //this.vx *= -1;
            P1.interaction(this);
        }
        if (this.x + this.width >= P2.x &&
            this.y <= P2.y + P1.height &&
            this.y + this.height >= P2.y) {
            P2.interaction(this);
            //this.vx *= -1;
        }
    }
    goal(canvasWidth) {
        if ((this.x <= 0) || (this.x >= (canvasWidth - this.width))) {
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
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
function randomAngleRad(minRad, maxRad) {
    if (minRad < maxRad) {
        return Math.random() * (maxRad - minRad) + minRad;
    }
    else {
        const range = 2 * Math.PI - minRad + maxRad;
        const rand = Math.random() * range;
        return (minRad + rand) % (2 * Math.PI);
    }
}
