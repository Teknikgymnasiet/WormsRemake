export class MainMenu {
    constructor(){

    }

    public preload(){
       this.game.load.image("MenuBackground","../assets/menu/menu_background.png");
    }

    public create(){
        this.game.add.sprite(1600,900,"MenuBackground")
    }
}
