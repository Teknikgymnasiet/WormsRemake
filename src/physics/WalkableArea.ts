const SimplexNoise = require('simplex-noise')
let simplex = new SimplexNoise(Math.random);

export class WalkableArea{
  public game:any;
  public ground:any;
  private _blockSize:number = 32;
  private _scale:number = 1;
  constructor(game:any){
      this.game = game;
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
          if( noiseArray[y][x] > 0.15 ) {
              let a = -500 + ( x*this.size);
              let b = 600 + ( y*this.size)
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


  //  console.log( value );
  /*  for(let x = 0; x < this.game.width * 4; x += this.size ) {
       // Add the ground blocks, enable physics on each, make them immovable
       let groundBlock = this.game.add.sprite(x, this.game.height - this.size, 'IronPlate');
       //groundBlock.scale = this._scale;
       this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
       groundBlock.body.immovable = true;
       groundBlock.body.allowGravity = false;
       this.ground.add(groundBlock);
   }*/
  }
}
