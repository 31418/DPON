const batTexture = new Texture('my_library/squizz.png');
const states = {
    Attack: 0,
    Evade: 1,
    Idle: 2,
}

class Bat extends TileSprite{
    constructor(findWayPoint, player){
        super(batTexture, 32, 32)
        console.log(batTexture.img)
        this.speed = 96;
        this.findWayPoint = findWayPoint;
        this.wayPoint = findWayPoint();
        this.pos.x = 500
        this.pos.y = 500
        this.hitBox = {
            x: 0,
            y: 0,
            w: 32,
            h: 32,
        }
        this.frame = {x: 4, y:0}
        console.log(this.pos)   
        console.log(this.wayPoint)



        this.state = new State(states.Idle)
        this.player = player;

    }
    update(dt, t){
        this.state.set(states.Idle);

        switch (this.state.get()){
            case states.Attack:
                const deltaX = this.player.pos.x - this.pos.x;
                const deltaY = this.player.pos.y - this.pos.y;
                const moveStep = this.speed * dt;
                const isXClose = Math.abs(deltaX) <= moveStep;
                const isYClose = Math.abs(deltaY) <= moveStep;
                
                if (!isXClose){
                    this.pos.x += this.speed * (deltaX > 0 ? 1 : -1) * dt;
                }
                if (!isYClose){
                    this.pos.y += this.speed * (deltaY > 0 ? 1 : -1) * dt;
                }

                if(isXClose && isYClose) {
                    this.wayPoint = this.findWayPoint();
                }
                break;
            case states.Evade:
                        const xd = this.player.pos.x - this.pos.x;
                        const yd = this.player.pos.y - this.pos.y;
                        const stepe = this.speed * dt
                        const x_closee = Math.abs(xd) <= stepe;
                        const y_closee = Math.abs(yd) <= stepe;
        
        if (!x_closee){
            this.pos.x -= this.speed * (xd > 0 ? 1 : -1) * dt;
        }
        if (!y_closee){
            this.pos.y -= this.speed * (yd > 0 ? 1 : -1) * dt;
        }



        if( x_closee && y_closee) {
            this.wayPoint = this.findWayPoint();
            console.log('new waypoint', this.wayPoint)
        }
                break;
            case states.Idle:
                
        const xo = this.wayPoint.x - this.pos.x;
        const yo = this.wayPoint.y - this.pos.y;
        const step = this.speed * dt
        const x_close = Math.abs(xo) <= step;
        const y_close = Math.abs(yo) <= step;
        
        if (!x_close){
            this.pos.x += this.speed * (xo > 0 ? 1 : -1) * dt;
        }
        if (!y_close){
            this.pos.y += this.speed * (yo > 0 ? 1 : -1) * dt;
        }



        if( x_close && y_close) {
            this.wayPoint = this.findWayPoint();
            console.log('new waypoint', this.wayPoint)
        }
        
                break;
        }
        this.state.update(dt);

        if (t % 0.5 < dt){
            this.frame.x = 5
        }
        if (t % 1 < dt){
            this.frame.x = 4
        }

    }
}