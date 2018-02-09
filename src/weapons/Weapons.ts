import { Weapon } from "./Weapon";

export class Weapons {
  public game:any;
  private _weaponList:any;
  constructor(game:any){
      this.game = game;
      this._weaponList = [];
  }


  get weapons() : any {
    return this._weaponList;
  }

  public addStandardWeapons() {
    let RPG7 = require("../weapon_configs/rpg7.json");

    this.add( RPG7 );

  }

  public add( cfg: any ) {
      let wep = new Weapon( cfg, this.game );
      this._weaponList.push(wep);
  }
}
