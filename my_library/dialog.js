class dialogScreen extends AddRemoveUpdate {
  constructor(
    controls,
    onClose,
    game,
    slowdown,
    dialogType,
    lootRecived,
    parent,
    screen
  ) {
    super();
    this.onClose = onClose;
    this.parent = parent;
    this.controls = controls;
    this.dialogType = dialogType;
    this.screen = screen;
    game.speed = slowdown;
    this.game = game;
    this.translateData = null;
    this.lastPressed = 0;
    this.arrowLastPressed = 0;
    this.lootRecived = lootRecived;

    this.selected = null;

    const bg = this.add(new TileSprite(new Texture("sdtwo/images/dialog.png")));
    bg.pos = { x: (game.w - 790) / 2, y: (game.h - 510) / 2 };

    //Wording
    if (dialogType === "loot") {
      for (let i = 0; i < lootRecived.length; i++) {
        if (lootRecived[i] === "+20h") {
          this.translateData = new TileSprite(
            new Texture("sdtwo/images/loot.png"),
            98,
            83,
            { x: 1, y: 0 }
          );
        } else if (lootRecived[i] === "+40h") {
          this.translateData = new TileSprite(
            new Texture("sdtwo/images/loot.png"),
            98,
            83,
            { x: 2, y: 0 }
          );
        } else if (lootRecived[i] === "+10b") {
          this.translateData = new TileSprite(
            new Texture("sdtwo/images/loot.png"),
            98,
            83,
            { x: 0, y: 0 }
          );
        } else if (lootRecived[i] === "+10d") {
          this.translateData = new TileSprite(
            new Texture("sdtwo/images/loot.png"),
            98,
            83,
            { x: 3, y: 0 }
          );
        }
        const item = this.add(this.translateData);
        item.pos.y = bg.pos.y + 50;
        item.pos.x = bg.pos.x + 50 + i * 120;
        console.log(i);
        this.translateData = null;
      }
    } else if (dialogType === "shop") {
      const shopbg = this.add(
        new TileSprite(new Texture("sdtwo/images/shop.png"))
      );
      shopbg.pos = { x: (game.w - 790) / 2, y: (game.h - 510) / 2 };

      const arrow = this.add(
        new TileSprite(new Texture("sdtwo/images/shop_keeper.png"), 32, 32, {
          x: 1,
          y: 0,
        })
      );
      arrow.pos = { x: bg.pos.x + 10, y: 0 };

      for (let i = 0; i < lootRecived.length; i++) {
        if (lootRecived[i] === "machine_gun") {
          this.translateData = new TileSprite(
            new Texture("sdtwo/images/shop_items.png"),
            217,
            69,
            { x: 0, y: 0 }
          );
        } else if (lootRecived[i] === "rifle") {
          this.translateData = new TileSprite(
            new Texture("sdtwo/images/shop_items.png"),
            217,
            69,
            { x: 0, y: 1 }
          );
        } else if (lootRecived[i] === "+10b") {
          this.translateData = new TileSprite(
            new Texture("sdtwo/images/shop_items.png"),
            217,
            69,
            { x: 1, y: 1 }
          );
        } else if (lootRecived[i] === "+20b") {
          this.translateData = new TileSprite(
            new Texture("sdtwo/images/shop_items.png"),
            217,
            69,
            { x: 1, y: 0 }
          );
        } else if (lootRecived[i] === "+5bags") {
          this.translateData = new TileSprite(
            new Texture("sdtwo/images/shop_items.png"),
            217,
            69,
            { x: 2, y: 0 }
          );
        }
        const item = this.add(this.translateData);
        item.pos.y = bg.pos.y + 100 + i * 80;
        item.pos.x = bg.pos.x + 50;

        this.arrow = arrow;
        this.bg = bg;
      }
    }

    console.log(controls);
  }

  close() {
    this.dead = true;
    this.onClose();
    this.game.speed = 1;
    console.log("closed dialog");
    if (this.parent) {
      this.parent.loot = [];
    }
  }

  update(dt) {
    this.lastPressed -= dt;
    this.arrowLastPressed -= dt;
    if (this.dialogType === "shop") {
      if (this.selected === null) {
        this.selected = 0;
      }
      const prize = this.lootRecived[this.selected];
      this.arrow.pos.y = this.bg.pos.y + this.selected * 80 + 100;

      if (this.controls.b && this.lastPressed <= 0) {
        this.lastPressed = 0.1;
        if (this.screen.money < 10) {
          this.close();
        }
        console.log(prize);
        if (
          !my_guns.includes(prize) &&
          (prize === "machine_gun" || prize === "rifle")
        ) {
          my_guns.push(prize);
          this.close();
        } else if (prize === "+10b" || prize === "+20b") {
          if (prize === "+10b") {
            this.screen.player.ammoPacks += 1;
            console.log("added 1 ammo");
          } else if (prize === "+20b") {
            this.screen.player.ammoPacks += 2;
            console.log("added 2 ");
          }
          this.close();
        } else if (prize === "+5bags") {
          this.screen.player.barriers += 5;
          this.close();
        } else {
          this.close();
        }
      }

      if (this.arrowLastPressed <= 0) {
        this.selected += this.controls.y;
        if (this.selected < 0) {
          this.selected = 0;
        }
        if (this.selected > this.lootRecived.length - 1) {
          this.selected = this.lootRecived.length - 1;
        }
        this.arrowLastPressed = 0.078;
      }
    }
    const exit = this.controls.esc;
    if (exit) {
      this.close();
    }
  }
}
