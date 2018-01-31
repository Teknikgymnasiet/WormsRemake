var Weapon = /** @class */ (function () {
    function Weapon() {
    }
    Object.defineProperty(Weapon.prototype, "owner", {
        set: function (player) {
            this._owner = player;
        },
        enumerable: true,
        configurable: true
    });
    Weapon.prototype.createWeaponSprite = function () {
    };
    Weapon.prototype.shoot = function () {
    };
    return Weapon;
}());
export { Weapon };
