var MainMenu = /** @class */ (function () {
    function MainMenu() {
    }
    MainMenu.prototype.preload = function () {
        this.game.load.image("MenuBackground", "../assets/menu/menu_background.png");
    };
    MainMenu.prototype.create = function () {
        this.game.add.sprite(1600, 900, "MenuBackground");
    };
    return MainMenu;
}());
export { MainMenu };
