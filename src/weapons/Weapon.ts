import { PlayerController } from "../player/PlayerController.ts";

export class Weapon implements IWeapon {
  public displayImage : any;
  public soundEffect : string;
  public minDamage:number;
  public maxDamage:number;
  public radius:number;
  public numberOfShots:number;
  public delayBetweenShots:number;
  private _owner:PlayerController;

  constructor( ){

  }

  set owner( player:PlayerController) {
    this._owner = player;
  }

  public createWeaponSprite() {

  }

  public shoot(){

  }
}
