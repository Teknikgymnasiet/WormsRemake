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
  private _sprite:any;

  private _owner:any;

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
    // Preload image
    this.game.load.image(this.ID, this.displayImage);
  }

  set owner( player:any) {
    this._owner = player;
  }

  public createWeaponSprite() {
    this._sprite = this._owner.addChild(this.game.make.sprite( 0,0,this.ID));
  }

  public shoot(){

  }
}
