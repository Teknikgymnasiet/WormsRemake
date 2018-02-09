(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BackgroundClouds_1 = require("../effects/BackgroundClouds");
var ForegroundWater_1 = require("../effects/ForegroundWater");
var WalkableArea_1 = require("../physics/WalkableArea");
var BackgroundController = /** @class */ (function () {
    function BackgroundController() {
    }
    Object.defineProperty(BackgroundController.prototype, "ground", {
        get: function () {
            return this._ground;
        },
        enumerable: true,
        configurable: true
    });
    BackgroundController.prototype.preload = function () {
        this._floof = new BackgroundClouds_1.BackgroundClouds(this.game);
        this._sploosh = new ForegroundWater_1.ForegroundWater(this.game);
        this._ground = new WalkableArea_1.WalkableArea(this.game);
        this.game.load.image("GameBackground1", "../assets/world/bright_sky.png");
        this.game.load.image("GameBackground2", "../assets/world/skyline.png");
        this._floof.preloadClouds();
        this._sploosh.preloadMoist();
        this._ground.preload();
    };
    BackgroundController.prototype.create = function () {
        //game.add.tileSprite(0, 0, 1920, 1920, 'background');
        this._background = this.game.add.tileSprite(0, 0, 6400, 900, "GameBackground1");
        this._background.scale = new Phaser.Point(1, 1);
        this._background.anchor = new Phaser.Point(0.5, 0.5);
        this._background.alpha = 0.9;
        this.game.world.setBounds(0, 0, 6400, 1920);
        this._skyline = this.game.add.tileSprite(0, 200, 6400, 820, "GameBackground2");
        this._skyline.scale = new Phaser.Point(0.36, 0.36);
        this.game.stage.backgroundColor = '#022968';
        this._floof.createClouds();
        //  this._sploosh.createMoist();
        this._ground.create();
    };
    BackgroundController.prototype.update = function () {
        this._floof.moveClouds();
        //  this._sploosh.updateMoist();
        //this._background.angle += 0.001;
    };
    return BackgroundController;
}());
exports.BackgroundController = BackgroundController;

},{"../effects/BackgroundClouds":2,"../effects/ForegroundWater":3,"../physics/WalkableArea":5}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BackgroundClouds = /** @class */ (function () {
    function BackgroundClouds(game) {
        this._numberOfClouds = 5;
        this._fileType = ".png";
        this.game = game;
    }
    BackgroundClouds.prototype.preloadClouds = function () {
        for (var i = 0; i < this._numberOfClouds; i++) {
            var textureID = "BGCloud" + i;
            var texturePath = "../assets/world/cloud" + i + this._fileType;
            this.game.load.image(textureID, texturePath);
            console.log("Currently Loading:", textureID, "from", texturePath);
        }
        console.log("Finished Pre-Loading Images!");
    };
    BackgroundClouds.prototype.createClouds = function () {
        this._clouds = [];
        for (var i = 0; i < this._numberOfClouds; i++) {
            this._clouds[i] = this.game.add.sprite(300, Math.random() * 25, "BGCloud" + i); // X, Y, Textur ID
            this._clouds[i].position.x += (i * 400); // Avgör startposition Sidled
            this._clouds[i].position.y += Math.random() * 100; // Avgör start position Höjdled
            this._clouds[i].scale = new Phaser.Point(0.75, 0.75); // Styr storleken, dvs Skalan
            this._clouds[i].alpha = 0.25;
            this._clouds[i].velocity = 1 + Math.random() * 4; // Styr hastigheten på molnen
        }
        console.log("Clouds:", this._clouds);
    };
    BackgroundClouds.prototype.moveClouds = function () {
        var offScreenOffset = 1000;
        for (var i = 0; i < this._clouds.length; i++) {
            var singleCloud = this._clouds[i]; // Ta en instans av ett moln i loopen
            singleCloud.position.x += 0.125 * singleCloud.velocity; // LÄgg till Hastigheten på molnets X position för att flytta det i sidled.
            if (singleCloud.position.x > 6400) {
                singleCloud.position.x = -offScreenOffset;
            }
        }
    };
    return BackgroundClouds;
}());
exports.BackgroundClouds = BackgroundClouds;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ForegroundWater = /** @class */ (function () {
    function ForegroundWater(game) {
        this._waterPosY = 512;
        this._waterWidth = 512;
        this.game = game;
    }
    ForegroundWater.prototype.preloadMoist = function () {
        this.game.load.image("MurkyWater", "../assets/water/murky_water.png");
        this.game.load.image("MurkyWaterMask", "../assets/water/murky_water_mask.png");
    };
    ForegroundWater.prototype.createMoist = function () {
        this._water = [];
        for (var i = 0; i < 1; i++) {
            this._water[i] = this.game.add.sprite(0, 0, "MurkyWater"); // X, Y, Textur ID
            this._water[i].position.x = i * this._waterWidth; // Avgör startposition Sidled
            this._water[i].position.y = this._waterPosY; // Avgör start position Höjdled
            this._water[i].alpha = 0.76;
        }
    };
    ForegroundWater.prototype.updateMoist = function () {
        //  this._water[1].position.x += Math.sin(Date.now());
    };
    return ForegroundWater;
}());
exports.ForegroundWater = ForegroundWater;

},{}],4:[function(require,module,exports){
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

},{"./states/GameRound":9,"./states/MainMenu":10}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WalkableArea = /** @class */ (function () {
    function WalkableArea(game) {
        this._blockSize = 256;
        this._scale = 1;
        this.game = game;
    }
    Object.defineProperty(WalkableArea.prototype, "size", {
        get: function () {
            return this._blockSize;
        },
        enumerable: true,
        configurable: true
    });
    WalkableArea.prototype.preload = function () {
        this.game.load.image("IronPlate", "../assets/materials/rusty_iron.png");
    };
    WalkableArea.prototype.create = function () {
        //  this.game.physics.enable( [ sprite1, sprite2 ], Phaser.Physics.ARCADE);
        this.ground = this.game.add.group();
        for (var x = 0; x < this.game.width; x += this.size) {
            // Add the ground blocks, enable physics on each, make them immovable
            var groundBlock = this.game.add.sprite(x, this.game.height - this.size, 'IronPlate');
            //groundBlock.scale = this._scale;
            this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
            groundBlock.body.immovable = true;
            groundBlock.body.allowGravity = false;
            this.ground.add(groundBlock);
        }
    };
    return WalkableArea;
}());
exports.WalkableArea = WalkableArea;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlayerModel_1 = require("./PlayerModel");
var PlayerView_1 = require("./PlayerView");
var PlayerController = /** @class */ (function () {
    function PlayerController(playerPicture, game) {
        this.game = game;
        this.game.load.image("Player", playerPicture);
        this._model = new PlayerModel_1.PlayerModel();
        this._view = new PlayerView_1.PlayerView(playerPicture, game);
        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.CONTROL
        ]);
    }
    PlayerController.prototype.update = function () {
        if (this.activeWeapon == undefined) {
            //console.log("Weapon is invalid!");
            return;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.CONTROL)) {
            this.activeWeapon.shoot();
        }
        var AimUp = this.game.input.keyboard.isDown(Phaser.Keyboard.UP);
        var AimDown = this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN);
        //  console.log("Vinkel och Riktnigt.", this.activeWeapon.sprite.angle, this.sprite.scale.x );
        if (AimUp && this.activeWeapon.sprite.angle < 90) {
            //  console.log("Aiming Up");
            this.activeWeapon.sprite.angle += 1.25;
        }
        else if (AimDown && this.activeWeapon.sprite.angle > -35) {
            //console.log("Aiming Down");
            this.activeWeapon.sprite.angle -= 1.25;
        }
    };
    Object.defineProperty(PlayerController.prototype, "activeWeapon", {
        get: function () {
            return this._activeWeapon;
        },
        set: function (weapon) {
            this._activeWeapon = weapon;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayerController.prototype, "sprite", {
        get: function () {
            return this.view.playerSprite;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayerController.prototype, "position", {
        // Get the world position of the player sprite.
        get: function () {
            if (!this.view.playerSprite) {
                console.error("Tried to get position of a non existing PlayerSprite.");
                return;
            }
            return this.view.playerSprite.position;
        },
        // Force change the position of the player sprite.
        set: function (position) {
            if (!this.view.playerSprite) {
                console.error("Tried to set position of a non existing PlayerSprite.");
                return;
            }
            this._position = position;
            this.view.playerSprite.position = this._position;
        },
        enumerable: true,
        configurable: true
    });
    PlayerController.prototype.createPlayer = function () {
        // Create our display object
        this.view.createPlayerSprite();
    };
    Object.defineProperty(PlayerController.prototype, "view", {
        get: function () {
            return this._view;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayerController.prototype, "model", {
        get: function () {
            return this._model;
        },
        enumerable: true,
        configurable: true
    });
    return PlayerController;
}());
exports.PlayerController = PlayerController;

},{"./PlayerModel":7,"./PlayerView":8}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlayerModel = /** @class */ (function () {
    function PlayerModel() {
        this._health = 100;
    }
    Object.defineProperty(PlayerModel.prototype, "health", {
        get: function () {
            return this._health;
        },
        set: function (healthPoints) {
            this._health = healthPoints;
        },
        enumerable: true,
        configurable: true
    });
    return PlayerModel;
}());
exports.PlayerModel = PlayerModel;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlayerView = /** @class */ (function () {
    function PlayerView(playerImage, game) {
        this._image = playerImage;
        this.game = game;
    }
    Object.defineProperty(PlayerView.prototype, "playerSprite", {
        get: function () {
            return this._sprite;
        },
        enumerable: true,
        configurable: true
    });
    PlayerView.prototype.createPlayerSprite = function () {
        this._sprite = this.game.add.sprite(300, 100, 'Player');
        this.game.physics.enable(this._sprite, Phaser.Physics.ARCADE);
        this._sprite.body.collideWorldBounds = true;
    };
    return PlayerView;
}());
exports.PlayerView = PlayerView;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BackgroundController_1 = require("../controller/BackgroundController");
var PlayerController_1 = require("../player/PlayerController");
var Weapons_1 = require("../weapons/Weapons");
var GameRound = /** @class */ (function () {
    function GameRound() {
        this.Gravity = 1300;
        this.MaxSpeed = 200;
        this.Drag = 600;
        this.JumpSpeed = -500;
        this.Acceleration = 500;
        this._pointingRight = false;
    }
    GameRound.prototype.preload = function () {
        this.background = new BackgroundController_1.BackgroundController();
        this.background.game = this.game;
        this.background.preload();
        this._testPlayer = new PlayerController_1.PlayerController("../../assets/player/worm1.png", this.game);
        this._weps = new Weapons_1.Weapons(this.game);
        this._weps.addStandardWeapons();
    };
    GameRound.prototype.create = function () {
        this.background.create();
        this._testPlayer.createPlayer();
        this.player = this._testPlayer.sprite;
        this.game.camera.follow(this.player);
        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.SPACEBAR,
            Phaser.Keyboard.DOWN
        ]);
        // Set player minimum and maximum movement speed
        this.player.body.maxVelocity.setTo(this.MaxSpeed, this.MaxSpeed * 10); // x, y
        // Add drag to the player that slows them down when they are not accelerating
        this.player.body.drag.setTo(this.Drag, 0); // x, y
        // Since we're jumping we need gravity
        this.game.physics.arcade.gravity.y = this.Gravity;
        this._weps.weapons[0].owner = this.player;
        this._weps.weapons[0].createWeaponSprite();
        this._testPlayer.activeWeapon = this._weps.weapons[0];
    };
    Object.defineProperty(GameRound.prototype, "player", {
        get: function () {
            return this._player;
        },
        set: function (p) {
            this._player = p;
        },
        enumerable: true,
        configurable: true
    });
    GameRound.prototype.update = function () {
        this.background.update();
        // Update collisions
        this.game.physics.arcade.collide(this._testPlayer.sprite, this.background.ground.ground);
        if (this._testPlayer != undefined) {
            this._testPlayer.update();
        }
        if (this.leftInputIsActive()) {
            // If the LEFT key is down, set the player velocity to move left
            this.player.body.acceleration.x = -this.Acceleration;
            if (this._pointingRight) {
                this.player.anchor.setTo(0.5, 0.5);
                this.player.scale.x = 1;
                this._pointingRight = false;
            }
        }
        else if (this.rightInputIsActive()) {
            // If the RIGHT key is down, set the player velocity to move right
            if (!this._pointingRight) {
                this.player.anchor.setTo(0.5, 0.5);
                this.player.scale.x = -1;
                this._pointingRight = true;
            }
            this.player.body.acceleration.x = this.Acceleration;
        }
        else {
            this.player.body.acceleration.x = 0;
        }
        // Set a variable that is true when the player is touching the ground
        var onTheGround = this.player.body.touching.down;
        if (onTheGround && this.upInputIsActive()) {
            // Jump when the player is touching the ground and the up arrow is pressed
            this.player.body.velocity.y = this.JumpSpeed;
        }
    };
    GameRound.prototype.leftInputIsActive = function () {
        return this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT);
    };
    GameRound.prototype.rightInputIsActive = function () {
        return this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
    };
    GameRound.prototype.upInputIsActive = function () {
        return this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
    };
    Object.defineProperty(GameRound.prototype, "background", {
        get: function () {
            return this._backgroundController;
        },
        set: function (bg) {
            this._backgroundController = bg;
        },
        enumerable: true,
        configurable: true
    });
    return GameRound;
}());
exports.GameRound = GameRound;

},{"../controller/BackgroundController":1,"../player/PlayerController":6,"../weapons/Weapons":14}],10:[function(require,module,exports){
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

},{"../utils/MenuButton":11}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
module.exports={
  "displayName" : "RPG-7",
  "ID": "RPG7",
  "displayImage" :  "../../assets/weapons/rpg7.png",
  "soundEffect" :  "../../assets/sound/rpg_shoot.mp3",
  "minDamage": 45,
  "maxDamage": 100,
  "radius": 100,
  "numberOfShots": 1,
  "delayBetweenShots": 0,
  "shootcallback": ""
}

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Weapon = /** @class */ (function () {
    function Weapon(config, game) {
        this.game = game;
        this.ID = config.ID;
        this.displayName = config.displayName;
        this.displayImage = config.displayImage;
        this.soundEffect = config.soundEffect;
        this.minDamage = config.minDamage;
        this.maxDamage = config.maxDamage;
        this.radius = config.radius;
        this.numberOfShots = config.numberOfShots;
        this.delayBetweenShots = config.delayBetweenShots;
        this.shootcallback = config.shootcallback;
        this.crosshairTexture = (config.crosshairTexture != undefined) ? config.crosshairTexture : "../../assets/ui/scope.png";
        // Preload image
        this.game.load.image(this.ID, this.displayImage);
        this.game.load.image("WeaponCrosshair", this.crosshairTexture);
        this.game.load.audio(this.ID + "Shoot", config.soundEffect);
        this.game.load.image("Football", "../../assets/football.png");
    }
    Object.defineProperty(Weapon.prototype, "owner", {
        set: function (player) {
            this._owner = player;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Weapon.prototype, "sprite", {
        get: function () {
            return this._sprite;
        },
        enumerable: true,
        configurable: true
    });
    Weapon.prototype.createWeaponSprite = function () {
        this._sprite = this._owner.addChild(this.game.make.sprite(0, 0, this.ID));
        this._sprite.position.x = 0;
        this._sprite.position.y = -16;
        this._crosshair = this._sprite.addChild(this.game.make.sprite(-100, 0, "WeaponCrosshair"));
        this._crosshair.scale.x = 0.1;
        this._crosshair.scale.y = 0.1;
        this._shootSound = this.game.add.audio(this.ID + "Shoot");
    };
    Weapon.prototype.shoot = function () {
        this._shootSound.play();
        var football = this._owner.addChild(this.game.make.sprite(0, 0, "Football"));
        football.position.setTo(this._sprite.position.x, this._sprite.position.y);
        //console.log("SKjuter!!");
        this.game.physics.enable(football, Phaser.Physics.ARCADE);
        console.log("SIktets position i världen:", this._crosshair.position);
        var angle = this._sprite.angle / (180 / Math.PI);
        var newX = Math.cos(angle);
        var newY = Math.sin(angle);
        var speed = 5000;
        football.body.allowGravity = true;
        football.body.velocity.setTo(-newX * speed, -newY * speed);
    };
    return Weapon;
}());
exports.Weapon = Weapon;

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Weapon_1 = require("./Weapon");
var Weapons = /** @class */ (function () {
    function Weapons(game) {
        this.game = game;
        this._weaponList = [];
    }
    Object.defineProperty(Weapons.prototype, "weapons", {
        get: function () {
            return this._weaponList;
        },
        enumerable: true,
        configurable: true
    });
    Weapons.prototype.addStandardWeapons = function () {
        var RPG7 = require("../weapon_configs/rpg7.json");
        this.add(RPG7);
    };
    Weapons.prototype.add = function (cfg) {
        var wep = new Weapon_1.Weapon(cfg, this.game);
        this._weaponList.push(wep);
    };
    return Weapons;
}());
exports.Weapons = Weapons;

},{"../weapon_configs/rpg7.json":12,"./Weapon":13}]},{},[4]);
