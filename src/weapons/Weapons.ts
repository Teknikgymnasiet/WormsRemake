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
    let RPG7 : any = {
      "displayName" : "RPG-7",
      "ID": "RPG7",
      "displayImage" :  "../../assets/weapons/rpg7.png",
      "soundEffect" :  "",
      "minDamage": 45,
      "maxDamage": 100,
      "radius": 100,
      "numberOfShots": 1,
      "delayBetweenShots": 0,
      "shootcallback": ""
    };

    this.add( RPG7 );

  }

  public add( cfg: any ) {
      let wep = new Weapon( cfg, this.game );
      this._weaponList.push(wep);
  }
}
