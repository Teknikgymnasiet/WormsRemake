(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WindowManager_1 = require("./WindowManager");
var Window = /** @class */ (function () {
    function Window() {
    }
    Window.createWindow = function () {
        Window.mainWindow = new Window.BrowserWindow(Window.WindowOptions);
        Window.Manager = new WindowManager_1.default(Window.mainWindow);
        Window.mainWindow.loadURL("http://127.0.0.1:1337/elec");
        Window.mainWindow.setMenu(null);
        Window.mainWindow.on('closed', Window.onClose);
    };
    Window.onReady = function () {
        Window.createWindow();
    };
    Window.onActivate = function () {
        if (Window.mainWindow == null) {
            Window.createWindow();
        }
    };
    Window.onWindowAllClosed = function () {
        if (process.platform !== 'darwin') {
            Window.application.quit();
        }
    };
    Window.onClose = function () {
        Window.mainWindow = null;
    };
    Window.init = function (app, browserWindow, windowoptions) {
        // we pass the Electron.App object and the 
        // Electron.BrowserWindow into this function
        // so this class has no dependencies.
        // this makes the code easier to write tests for.
        Window.WindowOptions = windowoptions;
        Window.BrowserWindow = browserWindow;
        Window.application = app;
        Window.application.on('window-all-closed', Window.onWindowAllClosed);
        Window.application.on('ready', Window.onReady);
        Window.application.on('activate', Window.onActivate);
    };
    return Window;
}());
exports.default = Window;

}).call(this,require('_process'))
},{"./WindowManager":2,"_process":8}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WindowManager = /** @class */ (function () {
    function WindowManager(mainWindow) {
        WindowManager.mainWindow = mainWindow;
    }
    WindowManager.toggleFullscreen = function () {
        WindowManager.mainWindow.setFullScreen(!WindowManager.mainWindow.isFullScreen());
    };
    WindowManager.ElectronIsRunning = function () {
        var userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf(" electron/") > -1) {
            return true;
        }
    };
    // Make keybind?
    WindowManager.openDevTools = function () {
        WindowManager.mainWindow.webContents.openDevTools();
    };
    return WindowManager;
}());
exports.default = WindowManager;

},{}],3:[function(require,module,exports){
module.exports={
    "width": 900,
    "height": 600,
    "title": "PhaserJS Worms Remake",
    "icon": "../assets/gameIcon.png",
    "resizable": false,
    "maximizable": false,
    "fullscreenable": true,
    "enableLargerThanScreen": false,
    "webPreferences": {
        "devTools": true,
        "nodeIntegration": true,
        "nodeIntegrationInWorker": false,
        "plugins": false,
        "zoomFactor": 1.0
    }
}

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var Window_1 = require("./Window");
var WindowOptions = require('./WindowOptions.json');
Window_1.default.init(electron_1.app, electron_1.BrowserWindow, WindowOptions);

},{"./Window":1,"./WindowOptions.json":3,"electron":6}],5:[function(require,module,exports){

},{}],6:[function(require,module,exports){
(function (__dirname){
var fs = require('fs')
var path = require('path')

var pathFile = path.join(__dirname, 'path.txt')

if (fs.existsSync(pathFile)) {
  module.exports = path.join(__dirname, fs.readFileSync(pathFile, 'utf-8'))
} else {
  throw new Error('Electron failed to install correctly, please delete node_modules/electron and try installing again')
}

}).call(this,"/node_modules/electron")
},{"fs":5,"path":7}],7:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":8}],8:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],9:[function(require,module,exports){
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

},{"../effects/BackgroundClouds":10,"../effects/ForegroundWater":11,"../physics/WalkableArea":13}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{"./states/GameRound":17,"./states/MainMenu":18}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{"./PlayerModel":15,"./PlayerView":16}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

},{"../controller/BackgroundController":9,"../player/PlayerController":14,"../weapons/Weapons":22}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Window_1 = require("../../electron/Window");
var MenuButton_1 = require("../utils/MenuButton");
var wmg = require('../../electron/');
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
        if (Window_1.default.Manager.ElectronIsRunning) {
            var fsButton = new MenuButton_1.MenuButton(this.game, 50, 400, "MenuButton", Window_1.default.Manager.toggleFullscreen, "Toggle Fullscreen");
        }
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

},{"../../electron/":4,"../../electron/Window":1,"../utils/MenuButton":19}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{"../weapon_configs/rpg7.json":20,"./Weapon":21}]},{},[12]);
