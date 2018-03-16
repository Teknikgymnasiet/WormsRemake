import { WindowManager } from "../../electron/WindowManager";
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
       this.game.load.image("MenuButton","../assets/menu/button_test.png");
    }

    private createButtons() {
      let button1 = new MenuButton(
        this.game, // Game REference
        50, // X Position
        100,  // Y position
        "MenuButton", // TExture ID
          function(){ // Callback, ONCLick
            this.game.state.start("GameRound"); 
          }.bind(this),
        "Nytt Spel" // Knapptext
      );

      let button2 = new MenuButton(
        this.game, // Game REference
        50, // X Position
        200,  // Y position
        "MenuButton", // TExture ID
          function(){ // Callback, ONCLick
              alert("Settings!");
          },
        "Inställningar"  // Knapptext
      );

      let button3 = new MenuButton(
        this.game,    // Game REference
        50,           // X Position
        300,          // Y position
        "MenuButton", // TExture ID
          function(){ // Callback, ONCLick
              alert("Credots!");
          },
        "Credits"     // Knapptext
      );
      if (WindowManager.ElectronIsRunning()) {
        let fsButton = new MenuButton(
        this.game,
        50,
        400,
        "MenuButton",
        () => {
          WindowManager.toggleFullscreen();
        },
        "Toggle Fullscreen",
        );
      }
      
    }

    public update() {

    }

    public create(){
        this._background = this.game.add.sprite( 0,0,"MenuBackground");
        this._logo = this.game.add.sprite( 0,0,"MenuLogo");
        this.createButtons();
    }
}
