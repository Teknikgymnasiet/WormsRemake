export module Teknikgymansiet {
  export class PlayerModel {
      private _playerPicture:any;
      private _health: number;

      constructor(playerPicture:any) {
          this._playerPicture = playerPicture;
          this._health = 100;
      }

      get health() : number {
        return this._health;
      }

      set health( healthPoints: number ) {
          this._health  = healthPoints;
      }


  }
}
