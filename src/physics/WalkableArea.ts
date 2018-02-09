export class WalkableArea{
  public game:any;
  public ground:any;
  private _blockSize:number = 256;
  private _scale:number = 1;
  constructor(game:any){
      this.game = game;
  }

  get size () :number {
    return  this._blockSize;
  }
  public preload() {
    this.game.load.image("IronPlate","../assets/materials/rusty_iron.png");
  }

  public create() {
  //  this.game.physics.enable( [ sprite1, sprite2 ], Phaser.Physics.ARCADE);
   this.ground = this.game.add.group();
   for(let x = 0; x < this.game.width * 4; x += this.size ) {
       // Add the ground blocks, enable physics on each, make them immovable
       let groundBlock = this.game.add.sprite(x, this.game.height - this.size, 'IronPlate');
       //groundBlock.scale = this._scale;
       this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
       groundBlock.body.immovable = true;
       groundBlock.body.allowGravity = false;
       this.ground.add(groundBlock);
   }
  }

}
