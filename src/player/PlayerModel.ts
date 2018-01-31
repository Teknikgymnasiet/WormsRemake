
export class PlayerModel {
    private _health: number;

    constructor() {
        this._health = 100;
    }

    get health() : number {
      return this._health;
    }

    set health( healthPoints: number ) {
        this._health  = healthPoints;
    }


}
