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
export { PlayerModel };
