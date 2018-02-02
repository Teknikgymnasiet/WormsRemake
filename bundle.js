(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BackgroundClouds = /** @class */ (function () {
    function BackgroundClouds(game) {
        this._numberOfClouds = 3;
        this._fileType = ".png";
        this.game = game;
    }
    BackgroundClouds.prototype.preloadClouds = function () {
        for (var i = 0; i < this._numberOfClouds; i++) {
            this.game.load.image("BGCloud" + i, "../assets/world/cloud" + i + this._fileType);
            console.log("Current Loop Value:", i);
        }
        console.log("Loop finished!");
    };
    BackgroundClouds.prototype.createClouds = function () {
        this._clouds = [];
        for (var i = 0; i < this._numberOfClouds; i++) {
            this._clouds[i] = this.game.add.sprite(300, 300, "BGCloud" + i);
            this._clouds[i].position.x += (i * 400);
            this._clouds[i].position.y += Math.random() * 100;
            this._clouds[i].scale = new Phaser.Point(0.5, 0.5);
            this._clouds[i].velocity = 1 + Math.random() * 3;
        }
        console.log("Clouds:", this._clouds);
    };
    BackgroundClouds.prototype.moveClouds = function () {
        var offScreenOffset = 1000;
        for (var i = 0; i < this._clouds.length; i++) {
            var singleCloud = this._clouds[i];
            singleCloud.position.x += singleCloud.velocity;
            if (singleCloud.position.x > 1600 + offScreenOffset) {
                singleCloud.position.x = -offScreenOffset;
            }
        }
    };
    return BackgroundClouds;
}());
exports.BackgroundClouds = BackgroundClouds;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MainMenu_1 = require("./states/MainMenu");
var GameRound_1 = require("./states/GameRound");
var WormsRemake = /** @class */ (function () {
    function WormsRemake() {
        this.game = new Phaser.Game(1600 /*Width*/, 900 /*Height*/, Phaser.AUTO, 'content', {
            preload: this.preload,
            create: this.create,
            update: this.update,
            render: this.render
        });
        this.game.state.add("MainMenu", MainMenu_1.MainMenu);
        this.game.state.add("GameRound", GameRound_1.GameRound);
    }
    WormsRemake.prototype.preload = function () {
    };
    // called when the game is created
    WormsRemake.prototype.create = function () {
        this.game.state.start("MainMenu");
    };
    // Called every "frame", counting the number of ticks per second would give you the famous "FPS", Frames Per Second
    WormsRemake.prototype.update = function () {
    };
    WormsRemake.prototype.render = function () {
    };
    return WormsRemake;
}());
exports.WormsRemake = WormsRemake;
var remake = new WormsRemake();

},{"./states/GameRound":3,"./states/MainMenu":4}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BackgroundClouds_1 = require("../effects/BackgroundClouds");
var GameRound = /** @class */ (function () {
    function GameRound() {
    }
    GameRound.prototype.preload = function () {
        this._floof = new BackgroundClouds_1.BackgroundClouds(this.game);
        this.game.load.image("GameBackground1", "../assets/world/background_dark_sky.jpg");
        this._floof.preloadClouds();
    };
    GameRound.prototype.create = function () {
        this._background = this.game.add.sprite(0, 0, "GameBackground1");
        this._floof.createClouds();
    };
    GameRound.prototype.update = function () {
        this._floof.moveClouds();
    };
    return GameRound;
}());
exports.GameRound = GameRound;

},{"../effects/BackgroundClouds":1}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MenuButton_1 = require("../utils/MenuButton");
var MainMenu = /** @class */ (function () {
    function MainMenu() {
    }
    MainMenu.prototype.preload = function () {
        this.game.load.image("MenuBackground", "../assets/menu/menu_background.png");
        this.game.load.image("MenuLogo", "../assets/menu/menu_logo.png");
        this.game.load.image("MenuButton", "../assets/menu/button_test.png");
    };
    MainMenu.prototype.createButtons = function () {
        var button1 = new MenuButton_1.MenuButton(this.game, // Game REference
        50, // X Position
        100, // Y position
        "MenuButton", // TExture ID
        function () {
            this.game.state.start("GameRound");
        }.bind(this), "Nytt Spel" // Knapptext
        );
        var button2 = new MenuButton_1.MenuButton(this.game, // Game REference
        50, // X Position
        200, // Y position
        "MenuButton", // TExture ID
        function () {
            alert("Settings!");
        }, "Inställningar" // Knapptext
        );
        var button3 = new MenuButton_1.MenuButton(this.game, // Game REference
        50, // X Position
        300, // Y position
        "MenuButton", // TExture ID
        function () {
            alert("Credots!");
        }, "Credits" // Knapptext
        );
    };
    MainMenu.prototype.update = function () {
    };
    MainMenu.prototype.create = function () {
        this._background = this.game.add.sprite(0, 0, "MenuBackground");
        this._logo = this.game.add.sprite(0, 0, "MenuLogo");
        this.createButtons();
    };
    return MainMenu;
}());
exports.MainMenu = MainMenu;

},{"../utils/MenuButton":5}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MenuButton = /** @class */ (function () {
    function MenuButton(game, x, y, textureId, callback, buttonText) {
        // ACtual button
        this._button = game.add.button(x, y, textureId, callback, this, 0, 0, 0);
        this._button.scale = new Phaser.Point(0.25, 0.25);
        // Text Label
        var textSettings = {
            fontSize: 32,
            font: "Arial Black",
            anchor: 0.5,
            padding: new Phaser.Point(1, 1)
        };
        this._buttonText = game.add.text(x, y, buttonText, textSettings);
        this._buttonText.position.y += 35;
        this._buttonText.position.x += 10;
    }
    return MenuButton;
}());
exports.MenuButton = MenuButton;

},{}]},{},[2]);
