import { BackgroundController } from "../controller/BackgroundController";
import { PlayerController } from "../player/PlayerController";
import { Weapons } from "../weapons/Weapons";

export class GameRound {
  public game : any;
  private _backgroundController : BackgroundController;
  private _testPlayer:any;
  private _player:any;
  public Gravity : number = 1300;
  public MaxSpeed : number = 200;
  public Drag : number = 600;
  public JumpSpeed : number = -500;
  public Acceleration : number = 500;
  private _pointingRight:boolean = false;
  private _weps:any;

  constructor() {

  }

  public preload(){
    this.background = new BackgroundController();
    this.background.game = this.game;
    this.background.preload();
    this._testPlayer = new PlayerController("../../assets/player/worm1_spritesheet.png",this.game);
    this._weps = new Weapons(this.game);
    this._weps.addStandardWeapons();
  }

  public create(){
    this.background.create();
    this._testPlayer.createPlayer();
    this.player = this._testPlayer.sprite;

    this.game.camera.follow( this.player );

    this.game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.LEFT,
      Phaser.Keyboard.RIGHT,
      Phaser.Keyboard.SPACEBAR,
      Phaser.Keyboard.DOWN
    ]);

      // Set player minimum and maximum movement speed
      this.player.body.maxVelocity.setTo( this.MaxSpeed, this.MaxSpeed * 10); // x, y
      // Add drag to the player that slows them down when they are not accelerating
      this.player.body.drag.setTo(this.Drag, 0); // x, y
      // Since we're jumping we need gravity
      this.game.physics.arcade.gravity.y = this.Gravity;

      let wep = this._weps.weapons[0];
      wep.owner = this.player;
      wep.controller = this._testPlayer;
      wep.createWeaponSprite();
      this._testPlayer.activeWeapon = wep;


  }



  set player(p:any){
    this._player = p;
  }

  get player() : any {
    return this._player;
  }

  public update(){
    this.background.update();
    // Update collisions
    this._testPlayer.activeWeapon.update();
    this.game.physics.arcade.collide( this._testPlayer.sprite, this.background.ground.ground );


    if( this._testPlayer != undefined ) {
      this._testPlayer.update();
    }
    if (this.leftInputIsActive()) {
         // If the LEFT key is down, set the player velocity to move left
         this.player.body.acceleration.x = -this.Acceleration;
         this.player.animations.play('walk', 6, false, false);

         if( this._pointingRight ) {
           this.player.anchor.setTo( 0.5, 0.5 );
           this.player.scale.x = 1;
           this._pointingRight = false;
         }
     } else if (this.rightInputIsActive()) {
         // If the RIGHT key is down, set the player velocity to move right
         this.player.animations.play('walk', 6, false, false);
         if( !this._pointingRight ) {
            this.player.anchor.setTo( 0.5, 0.5 );
           this.player.scale.x = -1;
           this._pointingRight = true;
         }
         this.player.body.acceleration.x = this.Acceleration;
     } else {
         this.player.body.acceleration.x = 0;
     }

     // Set a variable that is true when the player is touching the ground
     var onTheGround = this.player.body.touching.down;

     if (onTheGround && this.upInputIsActive()) {
         // Jump when the player is touching the ground and the up arrow is pressed
         this.player.body.velocity.y = this.JumpSpeed;
     }
  }

  private leftInputIsActive() {
    return this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT);
  }

  private rightInputIsActive() {
    return this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
  }

  private upInputIsActive() {
    return this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
  }


  set background( bg: BackgroundController ) {
    this._backgroundController = bg;
  }

  get background() : BackgroundController {
    return this._backgroundController;
  }

}
