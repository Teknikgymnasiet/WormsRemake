
export class PlayerView {
    private _sprite:any;
    private _image:any;
    public game:any;

    constructor( playerImage:any, game:any ) {
        this._image = playerImage;
        this.game = game;
    }

    get playerSprite() : any {
      return this._sprite;
    }

    public createPlayerSprite() {
      this._sprite = this.game.add.sprite(300, 100, 'Player');
      this.game.physics.enable(this._sprite, Phaser.Physics.ARCADE);
      this._sprite.body.collideWorldBounds = true;
    }
}
