import { BackgroundClouds } from "../effects/BackgroundClouds";
import { ForegroundWater } from "../effects/ForegroundWater";
import { WalkableArea } from "../physics/WalkableArea";

export class BackgroundController {
  public game:any;
  private _background:any;
  private _floof : BackgroundClouds;
  private _sploosh: ForegroundWater;
  private _ground : WalkableArea;
  private _skyline: any;

  constructor() {
  }

  get ground() : WalkableArea {
    return this._ground;
  }

  public preload(){
      this._floof = new BackgroundClouds(this.game);
      this._sploosh = new ForegroundWater(this.game);
      this._ground = new WalkableArea(this.game);

      this.game.load.image("GameBackground1","../assets/world/bright_sky.png");
      this.game.load.image("GameBackground2","../assets/world/skyline.png");

      this._floof.preloadClouds();
      this._sploosh.preloadMoist();
      this._ground.preload();
  }

  public create(){
    //game.add.tileSprite(0, 0, 1920, 1920, 'background');
    this._background = this.game.add.tileSprite( 0,0,6400, 900,"GameBackground1");
    this._background.scale = new Phaser.Point( 1, 1 );
    this._background.anchor = new Phaser.Point( 0.5, 0.5);
    this._background.alpha = 0.9;

    this.game.world.setBounds(0, 0, 6400, 1920);

    this._skyline = this.game.add.tileSprite( 0, 200, 6400, 820, "GameBackground2");
    this._skyline.scale = new Phaser.Point( 0.36, 0.36 );

    this.game.stage.backgroundColor = '#022968';

    this._floof.createClouds();
  //  this._sploosh.createMoist();
    this._ground.create();
  }

  public update(){
    this._floof.moveClouds();
  //  this._sploosh.updateMoist();
    //this._background.angle += 0.001;
  }
}
