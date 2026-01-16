class PickUp extends TileSprite {
  constructor(texture, pos = { x: 0, y: 0 }, frame = { x: 6, y: 0 }) {
    //do not forget to add the texture
    super(texture, 32, 32);

    this.hitBox = {
      x: 5,
      y: 8,
      w: 22,
      h: 20,
    };
    this.pos = pos;
    this.health = 100;
    this.frame = frame;
  }
}

class Item extends TileSprite {
  constructor(texture, pos = { x: 0, y: 0 }, frame = { x: 6, y: 0 }) {
    //do not forget to add the texture
    super(texture, 32, 32);

    this.hitBox = {
      x: 5,
      y: 8,
      w: 22,
      h: 20,
    };
    this.pivot = { x: 0.5, y: 20 };
    this.pos = pos;
    this.health = 100;
    this.frame = frame;
    //starts out false
    this.visible = false;
  }
  swing(timer) {
    let swingAmount = 0;
    if (this.player.facing === "right") {
      swingAmount = 0.2;
    } else {
      swingAmount = -0.2;
    }
    if (timer > 0.2) {
      this.rotation -= swingAmount;
    } else {
      this.rotation += swingAmount * 4;
    }
  }
  update(dt, t) {
    super.update(dt, t);

    if (this.visible) {
      this.alpha = 1;
    } else {
      this.alpha = 0;
    }
    if (this.player) {
      if (this.player.facing === "right") {
        this.pivot.x = 0.5;
      } else {
        this.pivot.x = 31.5;
      }
    }
  }
}

class ItemDisplay extends TileSprite {
  constructor(
    texture,
    pos = { x: 0, y: 0 },
    frame = { x: 6, y: 0 },
    mouse,
    player,
    i
  ) {
    //do not forget to add the texture
    super(texture, 32, 32);

    this.hitBox = {
      x: 0,
      y: 0,
      w: 32,
      h: 32,
    };
    this.pivot = { x: 0.5, y: 20 };
    this.pos = pos;
    this.ogPos = pos;
    this.health = 100;
    this.frame = frame;

    this.mouse = mouse;

    this.clicked = false;
    this.clickedUnTime = 0;

    this.player = player;

    this.number = i;
    this.ogNumber = i;

    this.type = this.player.inventory[i];

    this.coolDown = 0;
  }
  update(dt, t) {
    super.update(dt, t);

    this.clickedUnTime -= dt;

    //to offset center()
    let mousePos = {};
    mousePos.pos = { x: this.mouse.pos.x - 16, y: this.mouse.pos.y - 16 };
    if (this.mouse.isDown && this.clickedUnTime < 0) {
      if (distanceEntity(this, mousePos) < 16) {
        if (this.player.itemMoused) {
          this.player.inventory = [];
          const s = this.player.itemMousedItem;
          this.pos = s.ogPos;
          s.pos = this.ogPos;

          const ogPos = this.ogPos;

          this.ogPos = s.ogPos;
          s.ogPos = ogPos;

          const sNum = s.number;
          s.number = this.number;
          this.number = sNum;

          this.clicked = false;
          s.clicked = false;

          this.slots.map((d) => {
            this.player.inventory[d.number] = d.type;
            d.clicked = false;
            d.clickedUnTime = 0.3;
          });

          this.player.itemMoused = false;
          this.player.itemMousedItem = null;
          this.player.computeHeld();
        } else {
          this.clickedUnTime = 0.25;
          this.clicked = true;
          this.player.itemMoused = true;
          this.player.itemMousedItem = this;
        }
      } else if (this.mouse.isDown) {
        this.clicked = false;
      }
    }

    if (this.clicked && this.clickedUnTime < 0) {
      this.clickedUnTime = 0.25;
      this.pos = this.mouse.pos;
    }
    if (this.clicked === false) {
      this.pos = this.ogPos;
      this.clicked = false;
    }

    this.alpha = -this.player.inventoryCooldowns[this.number];
    if (this.alpha > 1) {
      this.alpha = 1;
    } else if (this.alpha < 0.3) {
      this.alpha = 0.3;
    }
  }
}
