export class ForegroundWater {
  public game:any;
  private _water:any;
  private _waterPosY : number = 512;
  private _waterWidth : number = 512;
  constructor( game: any ) {
    this.game = game;

  }

  public preloadMoist() {
    this.game.load.image("MurkyWater","../assets/water/murky_water.png");
    this.game.load.image("MurkyWaterMask","../assets/water/murky_water_mask.png");
  }

  public createMoist() {
    this._water = [];
    for( var i=0; i < 1; i++ ) {

      this._water[i] = this.game.add.sprite( 0,0,"MurkyWater" ); // X, Y, Textur ID
      this._water[i].position.x = i * this._waterWidth; // Avgör startposition Sidled
      this._water[i].position.y = this._waterPosY; // Avgör start position Höjdled
      this._water[i].alpha = 0.76;

    }
  }

  public updateMoist(){
      //  this._water[1].position.x += Math.sin(Date.now());
  }

}
