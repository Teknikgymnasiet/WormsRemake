
export class PlayerView {
    private _sprite:any;
    private _image:any;
    constructor( playerImage:any ) {
        this._image = playerImage;
    }

    get playerSprite() : any {
      return this._sprite;
    }

    public createPlayerSprite() {
        // ToDo: Create the sprite and add it to the 'canvas'

    }
}
