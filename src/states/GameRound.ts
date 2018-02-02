import { BackgroundClouds } from "../effects/BackgroundClouds";

export class GameRound {
  public game:any;
  private _background:any;
  private _floof : BackgroundClouds;

  constructor() {

  }

  public preload(){
      this._floof = new BackgroundClouds(this.game);
      this.game.load.image("GameBackground1","../assets/world/background_dark_sky.jpg");
      this._floof.preloadClouds();
  }

  public create(){
    this._background = this.game.add.sprite( 0,0,"GameBackground1");
    this._floof.createClouds();
  }

  public update(){
    this._floof.moveClouds();
  }
}
