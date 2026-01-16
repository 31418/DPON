class TileMap extends AddRemoveUpdate {
  constructor(tiles, mapW, mapH, tileW, tileH, texture) {
    super();
    this.mapH = mapH;
    this.mapW = mapW;
    this.tileW = tileW;
    this.tileH = tileH;
    this.w = mapW * tileW;
    this.h = mapH * tileH;

    console.log(this.w, this.h, "w and h of tilemap");

    this.children = tiles.map((frame, i) => {
      const s = new TileSprite(texture, tileW, tileH);
      s.frame = frame;
      s.pos = {
        x: (i % mapW) * tileW,
        y: Math.floor(i / mapW) * tileH,
      };
      return s;
    });
  }
  pixelToMapPos(pos) {
    const { tileW, tileH } = this;
    return {
      x: Math.floor(pos.x / tileW),
      y: Math.floor(pos.y / tileH),
    };
  }

  mapToPixelPos(pos) {
    const { tileW, tileH } = this;
    return {
      x: pos.x * tileW,
      y: pos.y * tileH,
    };
  }

  tileAtMapPos(mapPos) {
    return this.children[mapPos.y * this.mapW + mapPos.x];
  }

  tileAtPixelPos(pos) {
    return this.tileAtMapPos(this.pixelToMapPos(pos));
  }

  setFrameAtMapPos(mapPos, frame, id) {
    const tile = this.tileAtMapPos(mapPos);
    tile.frame = frame;
    if (id) {
      tile.frame.id = id;
    }
    return tile;
  }

  setFrameAtPixelPos(pos, frame) {
    return this.setFrameAtMapPos(this.pixelToMapPos(pos), frame);
  }
  tilesAtCorners(bounds, xo = 0, yo = 0) {
    return [
      [bounds.x, bounds.y],
      [bounds.x + bounds.w, bounds.y],
      [bounds.x, bounds.y + bounds.h],
      [bounds.x + bounds.w, bounds.y + bounds.h],
    ].map(([x, y]) =>
      this.tileAtPixelPos({
        x: x + xo,
        y: y + yo,
      })
    );
  }
  findFreeSpot(req = null) {
    console.log(req);
    let found = false;
    let x, y;
    while (!found) {
      x = rand(this.mapW);
      y = rand(this.mapH);
      const { frame } = this.tileAtMapPos({ x, y });
      if (req === null) {
        if (frame.walkable) {
          found = true;
        }
      } else {
        if (frame.id === req) {
          found = true;
        }
      }
    }
    return this.mapToPixelPos({ x, y });
  }
  findNearbyFreeSpot(ent, radius = 320) {
    let found = false;
    var spot = this.findFreeSpot();
    while (!found) {
      if (distance(spot, ent.pos) < radius) {
        found = true;
        return spot;
      } else {
        spot = this.findFreeSpot();
      }
    }
  }
}
