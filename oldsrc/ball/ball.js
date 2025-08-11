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
        this.speed = 10;
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
    colisionMultiple(paddles, canvasHeight, tracker) {
        if (this.y + this.vy <= 0 || this.y + this.height + this.vy >= canvasHeight)
            this.vy *= -1;
        for (const paddle of paddles) {
            this.colision(paddle, canvasHeight, tracker);
        }
    }
    colision(paddle, canvasHeight, tracker) {
        if (paddle.x < this.x) {
            if (this.x <= paddle.x + paddle.width &&
                this.y <= paddle.y + paddle.height &&
                this.y + this.height >= paddle.y) {
                paddle.interaction(this);
                tracker.recordHit();
            }
        }
        else {
            if (this.x + this.width >= paddle.x &&
                this.y <= paddle.y + paddle.height &&
                this.y + this.height >= paddle.y) {
                paddle.interaction(this);
                tracker.recordHit();
            }
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
    serialize() {
        return { info: {
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
            } };
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
