export class MainMenu {
    public game:any;
    constructor(){ // aa

    }

    public preload(){
       this.game.load.image("MenuBackground","../assets/menu/menu_background.png");
    }

    public create(){
        this.game.add.sprite(1600,900,"MenuBackground")
    }
}
