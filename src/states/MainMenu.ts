import { MenuButton } from "../utils/MenuButton";

export class MainMenu { // Phaser State
    public game:any;
    private _logo:any;
    private _background:any;
    constructor(){

    }

    public preload(){
       this.game.load.image("MenuBackground","../assets/menu/menu_background.png");
       this.game.load.image("MenuLogo","../assets/menu/menu_logo.png");
       this.game.load.image("MenuButton","../assets/menu/button1.png");
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
          "Nytt Spel"  // Knapptext
      );

      let button2 = new MenuButton(
        this.game, // Game REference
        this.game.width/2, // X Position
        500,  // Y position
        "MenuButton", // TExture ID
          function(){ // Callback, ONCLick
              alert("Settings!");
          },
        "Inställningar"  // Knapptext
      );

      let button3 = new MenuButton(
        this.game,    // Game REference
        this.game.width/2,           // X Position
        700,          // Y position
        "MenuButton", // TExture ID
          function(){ // Callback, ONCLick
              alert("Credots!");
          },
        "Credits"     // Knapptext
      );
    }

    public update() {

    }

    public create(){
        this._background = this.game.add.sprite( 0,0,"MenuBackground");
        this._logo = this.game.add.sprite( this.game.width/2,100,"MenuLogo");
        this._logo.anchor.setTo( 0.5, 0.5 );
        this.createButtons();
    }
}
