class GameOverScreen extends AddRemoveUpdate {
    constructor(game, controls, stats, onStart, statsScreen, creditsScreen) {
      super();
  
      this.onStart = onStart;
      this.controls = controls;
      this.statsScreen = statsScreen;
      this.creditsScreen = creditsScreen;



      const drawText = (msg, pos, size = 24) => {
        const font = `${size}pt 'VT323', monospace`;
        const text = new Text(msg, { font: font, fill: "#111", align: "center" });
        text.pos = pos;
        this.add(text);
      };
  
      this.add(new Level(game.w, game.h));
  
      drawText('Game Over', { x: game.w / 2, y: game.h / 2 - 50 }, 48);
      drawText('Score: ' + stats, {x: game.w / 2, y: game.h / 2}, 24)
      drawText('Press E to play again', { x: game.w / 2, y: game.h / 2 + 50 }, 24);
      drawText('Press R to view stats', { x: game.w / 2, y: game.h / 2 + 80 }, 24);
      drawText('Press T for credits', { x: game.w / 2, y: game.h / 2 + 110 }, 24);

              if (localStorage.getItem('gamesPlayedSquizzBall') === null){
            localStorage.setItem('gamesPlayedSquizzBall', '1');
        }

        
        const gamesPlayed = parseInt(localStorage.getItem('gamesPlayedSquizzBall')) || 0;
        localStorage.setItem('gamesPlayedSquizzBall', gamesPlayed + 1);


    }
  
    update(dt, t) {
      super.update(dt, t);
  
        if (controls.action) {
          this.onStart();
        }
        else if (controls.r){
            this.statsScreen();
        }
        else if (controls.t){
            this.creditsScreen();
        }

    }
  }