var PlayerView = /** @class */ (function () {
    function PlayerView(playerImage) {
        this._image = playerImage;
    }
    Object.defineProperty(PlayerView.prototype, "playerSprite", {
        get: function () {
            return this._sprite;
        },
        enumerable: true,
        configurable: true
    });
    PlayerView.prototype.createPlayerSprite = function () {
        // ToDo: Create the sprite and add it to the 'canvas'
    };
    return PlayerView;
}());
export { PlayerView };
