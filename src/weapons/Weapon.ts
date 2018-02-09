import { PlayerController } from "../player/PlayerController";
import { IWeapon } from "./IWeapon";
export class Weapon implements IWeapon {
  public game:any;
  public displayName: string;
  public displayImage : any;
  public soundEffect : string;
  public minDamage:number;
  public maxDamage:number;
  public radius:number;
  public numberOfShots:number;
  public delayBetweenShots:number;
  public shootcallback:any;
  public ID:any;
  public crosshairTexture:any;
  private _sprite:any;

  private _owner:any;
  private _crosshair:any;

  constructor( config:any,game:any ){
    this.game = game;
    this.ID = config.ID;
    this.displayName = config.displayName;
    this.displayImage = config.displayImage;
    this.soundEffect = config.soundEffect;
    this.minDamage=config.minDamage;
    this.maxDamage=config.maxDamage;
    this.radius=config.radius;
    this.numberOfShots=config.numberOfShots;
    this.delayBetweenShots=config.delayBetweenShots;
    this.shootcallback=config.shootcallback;
    this.crosshairTexture = ( config.crosshairTexture != undefined ) ? config.crosshairTexture : "../../assets/ui/scope.png";

    // Preload image
    this.game.load.image(this.ID, this.displayImage);
    this.game.load.image( "WeaponCrosshair", this.crosshairTexture );
    this.game.load.image( "Football", "../../assets/football.png" );

  }

  set owner( player:any) {
    this._owner = player;
  }

  get sprite() : any {
    return this._sprite;
  }

  public createWeaponSprite() {
    this._sprite = this._owner.addChild(this.game.make.sprite( 0,0,this.ID));
    this._sprite.position.x = 0;
    this._sprite.position.y = -16;

    this._crosshair = this._sprite.addChild( this.game.make.sprite( -100,0, "WeaponCrosshair" ) );
    this._crosshair.scale.x = 0.1;
    this._crosshair.scale.y = 0.1;

  }

  public shoot(){

      let football = this._owner.addChild(this.game.make.sprite( 0,0, "Football"));
      football.position.setTo( this._sprite.position.x, this._sprite.position.y );
        //console.log("SKjuter!!");
      this.game.physics.enable(football, Phaser.Physics.ARCADE);
      console.log("SIktets position i världen:", this._crosshair.position);
      let angle : number = this._sprite.angle / ( 180/Math.PI);
      let newX : number = Math.cos( angle );
      let newY : number = Math.sin( angle );
      let speed : number = 5000;

      football.body.allowGravity = true;
      football.body.velocity.setTo( -newX * speed, -newY * speed );
  }
}
