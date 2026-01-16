const logoTexture = new Texture('my_library/logo.png')

class LogoScreen extends AddRemoveUpdate{
    constructor(game, onStart){
        super()
        this.onStart = onStart
        this.life = 0.5
        const logo = this.logo = this.add(new Sprite(logoTexture))
        logo.pos = {x:0, y:0}
    }
    update(dt){
        super.update(dt)
        this.life -= dt
        if (this.life < 0){
            this.onStart()
        }
    }
}