const Maptexture = new Texture('my_library/tileMap.png')
const coin_texture = new Texture('my_library/squizz.png')

class Level extends TileMap{
    constructor(w, h){
        const tileSize = 32;
        const mapW = Math.floor(w / tileSize)
        const mapH = Math.floor(h / tileSize)
        const level = [];
        const bombs = [];
        const coins = [];
        var lastTimeCollectingCoin = Date.now()
        for (let i = 0; i < mapW * mapH; i++) {
            const isTopOrBottom = i < mapW || Math.floor(i / mapW) === mapH - 1;
            const isLeft = i % mapW === 0;
            const isRight = i % mapW === mapW - 1;
      
            if (isTopOrBottom) {
              level.push({ x: 3, y: 0 });
            } else if (isLeft) {
              level.push({ x: 3, y: 0 });
            } else if (isRight) {
              level.push({ x: 3, y: 0 });
            } else {
              if (Math.random() > 0.99){
                level.push({x:5, y:0})
                const thisTileW = i % mapW * 32;
                const thisTileH = Math.floor(i / mapW) * 32;
                bombs.push({x: thisTileW, y: thisTileH})
              }
              else if(Math.random() > 0.95){
                level.push({x:6, y:0})
                const thisTileW = i % mapW * 32
                const thisTileH = Math.floor(i/mapW) * 32
                coins.push({x:thisTileW, y:thisTileH})
              }
              else{
                level.push({x:6, y:1});
              }
            }
          }
        super(level, mapW, mapH, tileSize, tileSize, Maptexture)


        this.bounds = {
            left: tileSize,
            right: w - tileSize - 32,
            top: tileSize,
            bottom: h - tileSize - 48
        }
        this.blank = { x: 4, y: 0 };
        this.lastTile = null;
        this.bombs = bombs;
        this.coins = coins
        this.lastTimeCollectingCoin = lastTimeCollectingCoin
    }    
    checkGround(pos){
      const {blank, lastTile} = this;
      const tile = this.tileAtPixelPos(pos)
      console.log(tile, 'tile at pos', tile.frame)
      if (lastTile === tile){
        return 'checked'
      }
      this.lastTile = tile;
      if (tile.frame !== blank){
        this.setFrameAtPixelPos(pos, blank)
        return 'solid';
      }
      return 'cleared'
    }
    checkBombs(pos, score, char, cam, par){
      const tile = this.tileAtPixelPos(pos)
      this.bombs.map(b => {
        if (b.x === tile.pos.x && b.y === tile.pos.y && tile.frame.x !== 4){
          console.log('bomb')
          b.dead = true
          char.lives -= 1
          cam.shake()
          cam.flash(0.3, 'red')
          par.play({x: b.x, y: b.y}, cam)
          return 'bomb'
        }
      })
      return 'safe'
    }
    checkCoins(pos, squizz, gmscreen, par){
      const tile = this.tileAtPixelPos(pos)
      this.coins.map(b => {
        if (b.x === tile.pos.x && b.y === tile.pos.y && Date.now() - this.lastTimeCollectingCoin > 200 && tile.frame.x !== 4){
          this.lastTimeCollectingCoin = Date.now()
          console.log('coin')
          b.dead = true
          
          squizz.scoreAmount += 100
          if (squizz.scoreAmount > 12900){
            squizz.speed = 200;
          }
          else if (squizz.scoreAmount > 9900){
            squizz.speed = 150;
          }
          const coin_show = new TileSprite(coin_texture, 32, 32)
          coin_show.frame = {x:4, y:1}
          const bling = gmscreen.add(new Bling(coin_show, 1, 10, squizz, gmscreen.camera))
          bling.pos.x = b.x
          bling.pos.y = b.y
          return 'coin'
        }
      })
      return 'not_coin'
    }
}