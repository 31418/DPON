function wallslide(ent, map, x = 64, y = 64) {
  let tiles;
  let tileEdge;
  const entbounds = bounds(ent);
  const hits = {up: false, down: false, left: false, right: false};

  // Final amounts of movement to allow
  let xo = x;
  let yo = y;

  // Check vertical movement
  if (y !== 0) {
    tiles = map.tilesAtCorners(entbounds, 0, yo);
    const [tl, tr, bl, br] = tiles.map(t => t && t.frame.walkable);


    // Hit your head
    if (y < 0 && !(tl && tr)) {
      hits.up = true;
      tileEdge = tiles[0].pos.y + tiles[0].h;
      yo = tileEdge - entbounds.y;
    }
    // Hit your feet
    if (y > 0 && !(bl && br)) {
      hits.down = true;
      tileEdge = (tiles[2].pos.y) - 1;
      yo = tileEdge - (entbounds.y + entbounds.h);
    }
  }

  // Check horizontal movement
  if (x !== 0) {
    tiles = map.tilesAtCorners(entbounds, xo, yo);
    const [tl, tr, bl, br] = tiles.map(t => t && t.frame.walkable);


    // Hit left edge
    if (x < 0 && !(tl && bl)) {
      hits.left = true;
      tileEdge = (tiles[0].pos.x) + (tiles[0].w);
      xo = tileEdge - entbounds.x;
    }
    // Hit right edge
    if (x > 0 && !(tr && br)) {
      hits.right = true;
      tileEdge = (tiles[1].pos.x) - 1;
      xo = tileEdge - (entbounds.x + entbounds.w);
    }
  }
  // xo & yo contain the amount we're allowed to move by.
  return { x: xo, y: yo, hits };
}
