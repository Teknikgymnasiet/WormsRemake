export class BackgroundClouds {
  public game:any;
  private _clouds:any;
  private _numberOfClouds: number = 3;
  private _fileType:string = ".png";

  constructor( game: any ) {
    this.game = game;

  }

  public preloadClouds() {
      for( var i=0; i < this._numberOfClouds; i++ ) {
        this.game.load.image("BGCloud" + i, "../assets/world/cloud" + i + this._fileType);
        console.log("Current Loop Value:", i);
      }
      console.log("Loop finished!")
  }

  public createClouds() {
    this._clouds = [];

    for( var i=0; i <  this._numberOfClouds; i++ ) {
        this._clouds[i] = this.game.add.sprite( 300,300,"BGCloud" + i );
        this._clouds[i].position.x += ( i * 400);
        this._clouds[i].position.y += Math.random() * 100;
        this._clouds[i].scale = new Phaser.Point( 0.5, 0.5 );
        this._clouds[i].velocity = 1 + Math.random()*3;
    }
    console.log("Clouds:", this._clouds);
  }

  public moveClouds() {
    let offScreenOffset = 1000;

    for( var i=0; i < this._clouds.length; i++ ) {

      let singleCloud = this._clouds[i];
      singleCloud.position.x += singleCloud.velocity;

      if( singleCloud.position.x > 1600 + offScreenOffset ) {
        singleCloud.position.x = -offScreenOffset;
      }
    }
  }
}
