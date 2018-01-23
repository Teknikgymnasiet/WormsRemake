///<reference path="./lib/phaser.comments.d.ts"/>
module Teknikgymansiet {
  export class WormsRemake {
      private _assetList:any;

      constructor() {
          this.game = new Phaser.Game(1600 /*Width*/, 900/*Height*/, Phaser.AUTO, 'content', {
              preload: this.preload,
              create: this.create,
              update: this.update,
              render: this.render
            });
      }

      public game: Phaser.Game;

      public preload() {

      }

      // called when the game is created
      public create() {

      }

      // Called every "frame", counting the number of ticks per second would give you the famous "FPS", Frames Per Second
      public update() {

      }

      public render() {

      }
  }
}
