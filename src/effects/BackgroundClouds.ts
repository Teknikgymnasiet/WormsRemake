export class BackgroundClouds {
  public game:any;
  private _clouds:any;
  private _numberOfClouds: number = 5;
  private _fileType:string = ".png";

  constructor( game: any ) {
    this.game = game;

  }

  public preloadClouds() {
      for( var i=0; i < this._numberOfClouds; i++ ) {
        let textureID:string = "BGCloud" + i;
        let texturePath:string = "../assets/world/cloud" + i + this._fileType;

        this.game.load.image(textureID, texturePath);

        console.log("Currently Loading:", textureID, "from", texturePath );

      }
      console.log("Finished Pre-Loading Images!");
  }

  public createClouds() {
    this._clouds = [];

    for( var i=0; i <  this._numberOfClouds; i++ ) {
        this._clouds[i] = this.game.add.sprite( 300,Math.random()*25,"BGCloud" + i ); // X, Y, Textur ID
        this._clouds[i].position.x += ( i * 400); // Avgör startposition Sidled
        this._clouds[i].position.y += Math.random() * 100; // Avgör start position Höjdled
        this._clouds[i].scale = new Phaser.Point( 0.75, 0.75 ); // Styr storleken, dvs Skalan
        this._clouds[i].alpha = 0.25;
        this._clouds[i].velocity = 1 + Math.random()*4; // Styr hastigheten på molnen
    }
    console.log("Clouds:", this._clouds);
  }

  public moveClouds() {
    let offScreenOffset = 1000;

    for( var i=0; i < this._clouds.length; i++ ) {

      let singleCloud = this._clouds[i]; // Ta en instans av ett moln i loopen
      singleCloud.position.x += 0.125 * singleCloud.velocity; // LÄgg till Hastigheten på molnets X position för att flytta det i sidled.

      if( singleCloud.position.x > 6400 ) { // När molnet är utanför så flyttar vi det till andra sidan, utanför skärmen
        singleCloud.position.x = -offScreenOffset;
      }
    }
  }
}
