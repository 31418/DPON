class TileSprite extends Sprite {
  constructor(texture, w, h, frame = { x: 0, y: 0 }) {
    super(texture);
    this.tileW = w;
    this.tileH = h;

    this.frame = frame;
    this.anims = new AnimManager(this);
  }
  update(dt) {
    this.anims.update(dt);
  }
  get w() {
    return this.tileW * Math.abs(this.scale.x);
  }

  get h() {
    return this.tileH * Math.abs(this.scale.y);
  }
}
