const SimplexNoise = require('simplex-noise');
// Simple class to handle map generation from sprites.
export class WalkableArea{
  public game:any;
  public ground:any;
  private _blockSize:number = 64;
  private _scale:number = 1;
  private config:any;
  constructor(game:any){
      this.game = game;
      this.config = require("../cfg/gameconfig.json");
  }

  get size () :number {
    return  this._blockSize;
  }
  public preload() {
    //this.game.load.image("IronPlate","../assets/materials/rusty_iron.png");
    this.game.load.image("IronPlate","../assets/materials/rock.png");
  }

  public create() {
  //  this.game.physics.enable( [ sprite1, sprite2 ], Phaser.Physics.ARCADE);
    this.ground = this.game.add.group();
    let simplex = new SimplexNoise( Math.random);
    let height : number = 40;
    let width : number = 200;
    let noiseArray : any[] = [];
    for (var y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if( !noiseArray[y] ) {
          noiseArray[y] = [];
        }
        let nx = x/width - 0.5
        let ny = y/height - 0.5;
        noiseArray[y][x] = simplex.noise2D(nx, ny);
      }
    }

  //  console.log("noiseArray:", noiseArray);
    for (var y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        //  console.log( "Val:", noiseArray[y][x] );
          if( noiseArray[y][x] > -0.1 ) {
            let a = -500 + ( x*this.size);
            let b = 1600 + ( -y*this.size);
            let groundBlock = this.game.add.sprite( a, b, 'IronPlate');
            //groundBlock.scale = this._scale;
            groundBlock.position.setTo( a, b );
            //  console.log(a,b);
            this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
            groundBlock.body.immovable = true;
            groundBlock.body.allowGravity = false;
            this.ground.add(groundBlock);
          }
        }
    }
  }
}
