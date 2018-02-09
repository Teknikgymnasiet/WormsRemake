export class MenuButton{
    private _button:Phaser.Button;
    private _buttonText:any;

    constructor(game:any, x:number, y:number, textureId:any, callback:any, buttonText:string ) {
      // ACtual button
      let width : number = 1179
      let height : number = 368
      this._button = game.add.button( x - width/2, y - height / 2, textureId, callback, this, 0,0,0);
      this._button.scale = new Phaser.Point( 1, 1);
      // Text Label
      this._button.alpha = 0.6;

      let textSettings = {
       fontSize: 32,
       font: "Arial Black",
       anchor: 0.5,
       padding: new Phaser.Point( 1, 1 )
      };

      this._buttonText = game.add.text( x, y, buttonText, textSettings );
      this._buttonText.anchor.setTo( 0.5, 0.5 );

    }
}
