export class MenuButton{
    private _button:Phaser.Button;
    private _buttonText:any;

    constructor(game:any, x:number, y:number, textureId:any, callback:any, buttonText:string ) {
      // ACtual button
      this._button = game.add.button( x, y, textureId, callback, this, 0,0,0);
      this._button.scale = new Phaser.Point( 0.25, 0.25);
      // Text Label

      let textSettings = {
       fontSize: 32,
       font: "Arial Black",
       anchor: 0.5,
       padding: new Phaser.Point( 1, 1 )
      };
      
      this._buttonText = game.add.text( x, y, buttonText, textSettings );
      this._buttonText.position.y += 35;
      this._buttonText.position.x += 10;

    }
}
