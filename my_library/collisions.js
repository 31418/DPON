
function deadInTracks(ent, map, x = 64, y = 64) {
  const thisbounds = bounds(ent);
  const tiles = map.tilesAtCorners(thisbounds, x, y);
  const walks = tiles.map(t => t && t.frame.walkable);
  const blocked = walks.some(w => !w)
  if (blocked){
    x = 0
    y = 0
  }
  return {x, y}


}
