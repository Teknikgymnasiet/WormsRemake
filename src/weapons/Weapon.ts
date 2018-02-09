import { PlayerController } from "../player/PlayerController";
import { IWeapon } from "./IWeapon";
export class Weapon implements IWeapon {

  // Public variables
  public game:any;
  public displayName: string;
  public displayImage : any;
  public soundEffect : string;
  public minDamage:number;
  public maxDamage:number;
  public radius:number;
  public numberOfShots:number;
  public delayBetweenShots:number;
  public shootcallback:any;
  public ID:any;
  public crosshairTexture:any;
  public launchForce:number;
  public bounciness:number;
  public maxBounces:number;

  // Internal Variables
  private _sprite:any;
  private _owner:any;
  private _crosshair:any;
  private _shootSound:any;
  private _canShoot:boolean;
  private _controller: PlayerController;
  private _projectiles:any;
  private _hasFired:any;
  private _numberOfBounces:number = 0;


  constructor( config:any,game:any ){

    this.game = game;
    this.parseWeaponConfig( config );
    // Preload image
    this.game.load.image(this.ID, this.displayImage);
    this.game.load.image( "WeaponCrosshair", this.crosshairTexture );
    this.game.load.image( this.ID + "Football", config.projectileImage );
    this.game.load.audio( this.ID + "Shoot", config.soundEffect );

    // Initialize our projectile array
    this._projectiles = [];

  }

  private parseWeaponConfig( config: any ) {
    this.ID = config.ID;
    this.displayName = config.displayName;
    this.displayImage = config.displayImage;
    this.soundEffect = config.soundEffect;
    this.minDamage = config.minDamage;
    this.maxDamage = config.maxDamage;
    this.radius = config.radius;
    this.launchForce = config.launchForce;
    this.numberOfShots = config.numberOfShots;
    this.delayBetweenShots = config.delayBetweenShots;
    this.shootcallback = config.shootcallback;
    this.crosshairTexture = ( config.crosshairTexture != undefined ) ? config.crosshairTexture : "../../assets/ui/scope.png";
    this.bounciness = config.bounciness;
    this.maxBounces = config.maxBounces;
  }

  set controller( ctrl: PlayerController ) {
    this._controller = ctrl;
  }

  get controller() : PlayerController {
    return this._controller;
  }

  set owner( player:any) {
    this._owner = player;
  }

  get sprite() : any {
    return this._sprite;
  }

  public createWeaponSprite() {
    this._sprite = this._owner.addChild(this.game.make.sprite( 0,0,this.ID ) );
    this._sprite.position.x = 0;
    this._sprite.position.y = 2;
    this._sprite.anchor.setTo( 0.5, 0.5 );
    this._crosshair = this._sprite.addChild( this.game.make.sprite( -100,0, "WeaponCrosshair" ) );
    this._crosshair.scale.x = 0.1;
    this._crosshair.scale.y = 0.1;
    this._crosshair.anchor.setTo( 0.5, 0.5 );
    this._shootSound = this.game.add.audio( this.ID + "Shoot" );
  }

  public update() {
    let groundCollection : any = this.game.state.getCurrentState().background.ground.ground;
    for( var i=0; i < this._projectiles.length; i++ ) {
        this.game.physics.arcade.collide( this._projectiles[i], groundCollection, this.onCollide.bind(this) );
    }
  }

  private onCollide( obj1 : any , obj2 : any  ) {

    this._numberOfBounces++;
    obj1.body.velocity.setTo( obj1.body.velocity.x * 0.75, obj1.body.velocity.y * 0.75 );
    if( this._numberOfBounces >= this.maxBounces ) {
        this.Explode( obj1, obj2 );
    }
    console.log( this._numberOfBounces );
  }

  public Explode( obj1:any, obj2: any ) {
      obj1.kill();
      setTimeout( function(){
        this.game.camera.follow( this._owner );
      }.bind(this), 3500 );
  }

  public reload() {
    this._hasFired = false;
  }

  public shoot(){
      if( this._hasFired ) {
        return;
      }

      let football = this.game.add.sprite( this._owner.position.x, this._owner.position.y, this.ID + "Football");
      this._projectiles.push(football);

      // Activate the physics system for this object
      this.game.physics.enable( football, Phaser.Physics.ARCADE);

      // Configure the physics settings
      football.body.allowGravity = true;
      football.body.bounce.set( this.bounciness );
      football.body.collideWorldBounds = true;

      // Play our shoot sound
      this._shootSound.play();

      // Delay in seconds
      let autoDeleteDelay : number = 5;
      // Create a local variable so we can pass the reference to our anonymous timeout function.
      let player = this._owner;
      let self = this;
      // Create an anonymous function for cleaning up the projectile in case it goes outside the map.
      let deletionTimer : any = setTimeout( function(){
          this.kill();
          this.game.camera.follow( player );
          self.reload();
      }.bind(football), autoDeleteDelay * 1000 );

      // Make the camera follow the projectile
      this.game.camera.follow( football );

      // Since our crosshair is a child of the player object we can not extrapolate
      // the launch angle by subtracting the player position from the crosshair position.
      // to fix this we rotate the vector using sine and cosine
      // but first we need to convert our degrees to radians
      // this gives us a normalized vector we can use to multiply our launch force against.
      let angle : number = this._sprite.angle / ( 180 / Math.PI );

      // Since we change our movement by inverting the X scale of the player sprite
      // We have to adjust for it when rotating our vector. If we're facing Right we need to get the inverse sine value.
      let dir : number = this._owner.scale.x;
      let newX : number = Math.cos( angle );
      let newY : number = dir == -1 ? -Math.sin( angle ) : Math.sin( angle );

      // Apply the force
      football.body.velocity.setTo( ( newX * this.launchForce ) * -this._owner.scale.x, ( newY * this.launchForce )  * -this._owner.scale.x );

      // Flip the switch so we can't fire again until we have reloaded
      this._hasFired = true;
  }
}
