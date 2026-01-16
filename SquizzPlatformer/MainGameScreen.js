class GameScreen extends AddRemoveUpdate {
  constructor(game, controls, mouse) {
    super();

    this.w = game.w;
    this.h = game.h;
    this.mouse = mouse;
    this.controls = controls;

    this.level = 1;
    this.levelData = null;
    this.spawnPos = new Vector();

    this.savedZombies = [];
    this.savedBats = [];
    this.savedPlayerData = null;
    this.loadingFromSave = false;

    this.loadFile();

    // ----- MAP -----
    const map = new Level(game.w * 3, game.h * 2, this.levelData);
    this.map = map;

    // ----- CONTAINERS -----
    this.arrows = this.add(new AddRemoveUpdate());
    this.zombies = this.add(new AddRemoveUpdate());
    this.bats = this.add(new AddRemoveUpdate());
    this.spawn = this.add(new AddRemoveUpdate());
    this.fx = this.add(new AddRemoveUpdate());
    this.inventoryItem = this.add(new AddRemoveUpdate());
    this.inventoryDisplay = this.add(new AddRemoveUpdate());
    this.inventoryDisplayBg = this.add(new AddRemoveUpdate());

    // ----- PLAYER -----
    const items = [
      "sword",
      "shield",
      "instaHeal",
      "dashUp",
      "dash",
      "hammer",
      "axe",
      "wind",
      "bow",
      "slownessBow",
    ];

    this.player = new Player(controls, map, mouse, this, items, (bullet) =>
      this.arrows.add(bullet)
    );

    this.player.pos = this.spawnPos;

    if (this.savedPlayerData) {
      this.player.health = this.savedPlayerData.health;
      this.player.xp = this.savedPlayerData.xp;
    }

    // ----- CAMERA -----
    const camera = this.add(
      new Camera(
        this.player,
        { w: game.w, h: game.h },
        { w: game.w * 3, h: game.h * 2 }
      )
    );

    this.map = camera.add(map);
    camera.add(this.player);
    camera.add(this.spawn);
    camera.add(this.zombies);
    camera.add(this.bats);
    camera.add(this.arrows);
    camera.add(this.fx);
    camera.add(this.inventoryItem);

    this.add(this.inventoryDisplay);
    this.add(this.inventoryDisplayBg);

    this.player.camera = camera;
    this.player.heldItemDisplay = this.inventoryItem;

    // ----- INVENTORY UI -----
    for (let i = 0; i < items.length; i++) {
      const item = this.inventoryItem.add(
        new Item(itemTextures[i], { x: 0, y: 0 })
      );
      item.visible = false;
      item.name = items[i];
      item.player = this.player;
    }

    for (let i = 0; i < 10; i++) {
      this.inventoryDisplay.add(
        new ItemDisplay(
          itemTextures[i],
          { x: 20 + i * 40, y: game.h - 50 },
          { x: 0, y: 0 },
          mouse,
          this.player,
          i
        )
      );

      const bg = this.inventoryDisplayBg.add(
        new Item(itemBg, { x: 20 + i * 40, y: game.h - 50 })
      );
      bg.visible = true;
    }

    this.inventoryDisplay.map((i) => (i.slots = this.inventoryDisplay));

    // ----- UI TEXT -----
    const drawText = (text, pos) => {
      const t = new Text(text, { font: "24pt VT323", fill: "#EEE" });
      t.pos = pos;
      return this.add(t);
    };

    this.score = drawText("", { x: 0, y: 30 });
    this.levelDisplay = drawText("", { x: 0, y: 80 });

    // ----- PARTICLES -----
    this.damageParticles = this.fx.add(new ParticleMaker(50, heart));

    // ----- ENEMIES -----
    this.restoreEnemies();
  }

  // ================= SAVE / LOAD =================
  playParticles(type, pos) {
    this.damageParticles.play(pos, this.camera);
  }

  saveFile() {
    const fileName = prompt("File Name:");

    const zombies = [];
    const bats = [];

    this.zombies.map((z) => {
      zombies.push({
        x: z.pos.x,
        y: z.pos.y,
        health: z.health,
        speed: z.speed,
      });
    });

    this.bats.map((b) => {
      bats.push({
        x: b.pos.x,
        y: b.pos.y,
        health: b.health,
        speed: b.speed,
      });
    });

    const saveData = {
      levelData: this.map.levelData,
      player: {
        x: this.player.pos.x,
        y: this.player.pos.y,
        health: this.player.health,
        xp: this.player.xp,
      },
      zombies,
      bats,
    };

    localStorage.setItem(fileName, JSON.stringify(saveData));
  }

  loadFile() {
    const fileName = prompt("File Name:");
    const raw = localStorage.getItem(fileName);

    if (!raw) {
      this.spawnPos = new Vector(250, 350);
      return;
    }

    const data = JSON.parse(raw);

    this.loadingFromSave = true;
    this.levelData = data.levelData;
    this.spawnPos = new Vector(data.player.x, data.player.y);
    this.savedPlayerData = data.player;
    this.savedZombies = data.zombies || [];
    this.savedBats = data.bats || [];
  }

  // ================= ENEMIES =================

  restoreEnemies() {
    if (!this.loadingFromSave) {
      this.newLevel(this.level);
      return;
    }

    this.savedZombies.forEach((e) => {
      const z = this.zombies.add(
        new Zombie(
          zombieTexture,
          this.map,
          this.player,
          new Vector(e.x, e.y),
          this
        )
      );
      z.health = e.health;
      z.speed = e.speed;
    });

    this.savedBats.forEach((e) => {
      const b = this.bats.add(
        new Bat(batTexture, this.map, this.player, new Vector(e.x, e.y), this)
      );
      b.health = e.health;
      b.speed = e.speed;
    });
  }

  newLevel(level) {
    this.level = level;

    for (let i = 0; i < level * 5; i++) {
      this.zombies.add(
        new Zombie(
          zombieTexture,
          this.map,
          this.player,
          this.map.findFreeSpot("zombie_spawn"),
          this
        )
      );
    }

    for (let i = 0; i < level * 3; i++) {
      this.bats.add(
        new Bat(
          batTexture,
          this.map,
          this.player,
          this.map.findFreeSpot(),
          this
        )
      );
    }
  }

  // ================= UPDATE =================

  update(dt, t) {
    super.update(dt, t);

    this.score.text = `Health: ${this.player.health}  XP: ${this.player.xp}`;
    this.levelDisplay.text = `Level: ${this.level}  Zombies: ${this.zombies.children.length}`;

    this.inventoryItem.map((i) => {
      if (this.player.held === i.name) {
        i.visible = true;
        const d = this.player.facing === "right" ? 25 : -25;
        i.pos.x = this.player.pos.x + d;
        i.pos.y = this.player.pos.y - 2;
        i.frame.x = this.player.facing === "right" ? 0 : 1;
      } else {
        i.visible = false;
      }
    });

    if (!this.loadingFromSave && this.zombies.children.length === 0) {
      this.newLevel(this.level + 1);
    }

    if (this.controls.action) {
      this.saveFile();
    }
  }
}
