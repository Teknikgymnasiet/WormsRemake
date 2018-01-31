///<reference path="./lib/phaser.comments.d.ts"/>
///<reference path="./states/MainMenu.ts"/>
//import { MainMenu } from "./states/MainMenu";
var Teknikgymansiet;
(function (Teknikgymansiet) {
    var WormsRemake = /** @class */ (function () {
        function WormsRemake() {
            this.game = new Phaser.Game(1600 /*Width*/, 900 /*Height*/, Phaser.AUTO, 'content', {
                preload: this.preload,
                create: this.create,
                update: this.update,
                render: this.render
            });
            this.game.state.add("MainMenu", MainMenu);
            this.game.state.start("MainMenu"); // ?
        }
        WormsRemake.prototype.preload = function () {
        };
        // called when the game is created
        WormsRemake.prototype.create = function () {
        };
        // Called every "frame", counting the number of ticks per second would give you the famous "FPS", Frames Per Second
        WormsRemake.prototype.update = function () {
        };
        WormsRemake.prototype.render = function () {
        };
        return WormsRemake;
    }());
    Teknikgymansiet.WormsRemake = WormsRemake;
})(Teknikgymansiet || (Teknikgymansiet = {}));
