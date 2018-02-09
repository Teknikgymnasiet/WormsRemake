import { PlayerModel } from "./PlayerModel";
import { PlayerView } from "./PlayerView";

export class PlayerController {
    private _model: PlayerModel; // This class contains our information.
    private _view: PlayerView;
    private _activeWeapon: any;
    private _position:any;
    public game:any;

    constructor(playerPicture:any, game:any) {
        this.game = game;
        //this.game.load.image("Player",playerPicture);
        game.load.spritesheet('Player', playerPicture, 32, 32, 2 );

        this._model = new PlayerModel();
        this._view = new PlayerView( playerPicture, game );

        this.game.input.keyboard.addKeyCapture([
          Phaser.Keyboard.UP,
          Phaser.Keyboard.DOWN,
          Phaser.Keyboard.CONTROL
        ]);

    }

    public update() {
      if( this.activeWeapon == undefined ){
      //console.log("Weapon is invalid!");
        return;
      }

      if( this.game.input.keyboard.isDown(Phaser.Keyboard.CONTROL)) {
        this.activeWeapon.shoot();
      }

      let AimUp = this.game.input.keyboard.isDown(Phaser.Keyboard.UP);
      let AimDown = this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN);

    //  console.log("Vinkel och Riktnigt.", this.activeWeapon.sprite.angle, this.sprite.scale.x );
      if( AimUp && this.activeWeapon.sprite.angle < 90 ) {
        //  console.log("Aiming Up");
          this.activeWeapon.sprite.angle += 1.25;
      } else if ( AimDown && this.activeWeapon.sprite.angle > -35 ) {
          //console.log("Aiming Down");
          this.activeWeapon.sprite.angle -= 1.25;
      }
    }

    set activeWeapon( weapon:any ) {
      this._activeWeapon = weapon;
    }

    get activeWeapon() : any {
      return this._activeWeapon;
    }

    get sprite() : any {
      return this.view.playerSprite;
    }

    // Force change the position of the player sprite.
    set position( position:any ) {
      if( !this.view.playerSprite ){
          console.error("Tried to set position of a non existing PlayerSprite.");
        return;
      }
      this._position = position;
      this.view.playerSprite.position = this._position;
    }

    // Get the world position of the player sprite.
    get position() : any {
      if( !this.view.playerSprite ){ // Sanity check, make sure we actually have a sprite.
          console.error("Tried to get position of a non existing PlayerSprite.");
        return;
      }

      return this.view.playerSprite.position;
    }

    public createPlayer() {
        // Create our display object
        this.view.createPlayerSprite();
    }

    get view() : PlayerView {
      return this._view;
    }

    get model() : PlayerModel {
      return this._model;
    }

}
