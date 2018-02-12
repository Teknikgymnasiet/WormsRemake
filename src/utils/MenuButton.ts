export class MenuButton{
    private _button:Phaser.Button;
    private _buttonText:any;

    constructor(game:any, x:number, y:number, textureId:any, callback:any, buttonText:string ) {

      let width : number = 1179
      let height : number = 368
      // We use width/2 and height/2 to center the button relative to the position specified when creating it
      this._button = game.add.button( x - width/2, y - height / 2, textureId, callback, this, 0,0,0);
      this._button.scale = new Phaser.Point( 1, 1);

      // Opacity of the button, slight see through for style
      this._button.alpha = 0.6;

      // Text Label
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
