const MapTexture = new Texture("my_library/tileMap.png");

class Level extends TileMap {
  constructor(w, h, saved) {
    const tileSize = 32;
    const mapW = Math.floor(w / tileSize);
    const mapH = Math.floor(h / tileSize);

    const tileIndexes = [
      { id: "floor", x: 0, y: 0, walkable: true },
      { id: "stone", x: 3, y: 0, walkable: false },
      { id: "grass", x: 3, y: 1, walkable: false },
      { id: "spike", x: 1, y: 0, walkable: true },
      { id: "cracked_stone", x: 0, y: 4, walkable: false },
      { id: "zombie_spawn", x: 0, y: 0, walkable: true },
    ];

    const level = Array(mapW * mapH).fill(0);

    const structures = [plat1, plat2];

    let fountainCount = 0;
    let fountainPos = [];
    let levelData = [];

    const structsPerRow = Math.floor(mapW / 16);
    const structsPerCol = Math.floor(mapH / 16);

    for (let y = 0; y < structsPerCol; y++) {
      for (let x = 0; x < structsPerRow; x++) {
        let paste;

        if (saved && saved.length) {
          paste = saved[y * structsPerRow + x];
        } else {
          if (randf(0, 1) < 0.8) {
            paste = randOneFrom(structures);
          } else if (randf(0, 1) < 0.5) {
            paste = fountain1;
            fountainCount++;
            fountainPos.push(x * 16, y * 16);
          } else if (randf(0, 1) < 0.5) {
            paste = spikes;
          } else {
            paste = tower;
          }

          if (x === 0 && y === 0) {
            paste = spawn;
          }

          levelData.push(paste);
        }

        pasteStructure(x * 16, y * 16, paste, level, mapW);
      }
    }

    // Ensure at least one fountain
    if (!saved && fountainCount < 1) {
      pasteStructure(256, 256, fountain1, level, mapW);
    }

    // Borders
    for (let i = 0; i < mapW; i++) {
      level[i] = 1;
      level[i * mapW] = 1;
      level[i * mapW + mapW - 1] = 1;
      level[mapW * (mapH - 1) - i] = 3;
      level[mapW * mapH - i] = 2;
    }

    super(
      level.map((i) => tileIndexes[i]),
      mapW,
      mapH,
      tileSize,
      tileSize,
      MapTexture
    );

    this.fountainCount = fountainCount;
    this.fountainPos = fountainPos;

    // IMPORTANT: reuse saved levelData if loading
    this.levelData = saved && saved.length ? saved : levelData;

    // Build grid for pathfinding
    const grid = [];
    for (let i = 0; i < level.length; i += mapW) {
      grid.push(level.slice(i, i + mapW));
    }

    const path = new EasyStar.js();
    path.setGrid(grid);

    const walkables = tileIndexes
      .map(({ walkable }, i) => (walkable ? i : -1))
      .filter((i) => i !== -1);

    path.setAcceptableTiles(walkables);

    this.path = path;
    this.mapW = mapW;
    this.mapH = mapH;
    this.level = level;
  }

  checkGround(pos) {
    return this.tileAtPixelPos(pos);
  }
}
