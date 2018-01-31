import { PlayerModel } from "./PlayerModel";
import { PlayerView } from "./PlayerView";
var PlayerController = /** @class */ (function () {
    function PlayerController(playerPicture) {
        this._model = new PlayerModel();
        this._view = new PlayerView(playerPicture);
    }
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
export { PlayerController };
