const topTexture = new Texture('my_library/evil.png')
class Enemy extends TileSprite{
    constructor(target, onFire, this_pos = {x: 0, y: 0}){
        super(topTexture, 32, 32)
        this.target = target;
        this.onFire = onFire;
        this.fireIn = 0
        this.pos = this_pos
        this.frame = {x: 1, y: 0};
        
    }
    fireAtTarget(){
        const angle = ent_angle(this, this.target)
        const x = Math.cos(angle);
        const y = Math.sin(angle);
        const bullet = new Bullet({x, y}, 200);
        bullet.pos.x = this.pos.x;
        bullet.pos.y = this.pos.y;
        this.onFire(bullet);
    }
    update(dt){
        if (randOneIn(1000) && this.fireIn <= 0){
            this.fireIn = 1
        }
        if (this.fireIn > 0){
            this.fireIn -= dt;
            this.frame.x = 0;

            if (this.fireIn < 0){
                this.fireAtTarget()
            }
        }
        else {
            this.frame.x = 1;
        }
    }
}