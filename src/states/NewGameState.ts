import { MenuButton } from "../utils/MenuButton";

export class NewGameState {
    public game:any;
    private _logo:any;
    private _background:any;
    constructor(){

    }

    public preload() {

    }
    
    private createButtons() {
        let button1 = new MenuButton(
          this.game, // Game REference
          this.game.width/2, // X Position
          300,  // Y position
          "MenuButton", // TExture ID
            function(){ // Callback, ONCLick
                  this.game.state.start("GameRound");
            }.bind(this),
          "Starta"  // Knapptext
      );


    }

    public create(){
        this._background = this.game.add.sprite( 0,0,"MenuBackground");
        this._background.scale.setTo( 0.5, 0.5 );
        this._background.alpha = 0.75;
        this._logo = this.game.add.sprite( this.game.width/2,100,"MenuLogo");
        this._logo.anchor.setTo( 0.5, 0.5 );
        this.createButtons();
    }
}
