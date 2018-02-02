import { MainMenu } from "./states/MainMenu";
import { GameRound } from "./states/GameRound";

export class WormsRemake {
    constructor() {
        this.game = new Phaser.Game(1600 /*Width*/, 900/*Height*/, Phaser.AUTO, 'content', {
            preload: this.preload,
            create: this.create,
            update: this.update,
            render: this.render
          });

          this.game.state.add("MainMenu", MainMenu );
          this.game.state.add("GameRound", GameRound );
    }

    public game: Phaser.Game;

    public preload() {

    }

    // called when the game is created
    public create() {
          this.game.state.start("MainMenu"); 
    }

    // Called every "frame", counting the number of ticks per second would give you the famous "FPS", Frames Per Second
    public update() {

    }

    public render() {

    }
}

let remake = new WormsRemake();
