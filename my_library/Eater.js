const Etexture = new Texture('my_library/squizz.png')
class Eater extends TileSprite {
    constructor(xSpeed, ySpeed){
        super(texture, 32, 32);
        this.xSpeed = xSpeed
        this.ySpeed = ySpeed
        this.pos.x = 0
        this.pos.y = 0
        this.anchor = {x: 0, y: 0};
    }
    update(dt){
        const {pos, xSpeed, ySpeed} = this
        this.pos.x += this.xSpeed * dt
        this.pos.y += this.ySpeed * dt

    }
}