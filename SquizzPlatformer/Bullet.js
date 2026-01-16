class Bullet extends TileSprite {
  constructor(dir, speed = 150, properties) {
    super(arrowPng, 32, 32);
    console.log("made");
    this.speed = speed;
    this.dir = dir;
    this.life = 20;
    this.pivot = { x: 16, y: 16 };
    this.rotation = angle(dir, { x: 0, y: 0 });
    this.hitBox = {
      x: 0,
      y: 0,
      w: 32,
      h: 32,
    };
    console.log(this.dir.x, this.dir.y, this.rotation);
    this.frame = { x: 0, y: 0 };

    this.properties = properties;
  }
  update(dt) {
    this.pos.x += dt * this.speed * this.dir.x;
    this.pos.y += dt * this.speed * this.dir.y;

    if ((this.life -= dt) < 0) {
      this.dead = true;
      console.log("bullet dead");
    }
  }
}
