//JS File
"use strict";

//HomingRocket

function HomingRocket() {
    SpecialTile.call(this, 4);

    this.thrusting = false;
    this.turning = false;
    this.exploding = false;
    this._turnType = 0; //0 = none, 1 = float up, 2 = float down, 3, = straight shot
    this.target = null;
    this._acceleration = 25;
    this._maxThrustSpeed = 700; //pix per sec
    this.xVelMult = 0;
    this.yVelMult = 0;
    this._timeToTurn = 200; //milliseconds - used for rotation speed
    this.rotation = 0;
    this._rotationSpeed = 0;
    this.loadAnimation(sprites.homing_rocket, "idle", true);
    this.playAnimation("idle");
}
HomingRocket.prototype = Object.create(SpecialTile.prototype);

//delay take-off by 0.15 secs and play animation (once ready), always takes off at 45 degree angle (way it's pointing)
HomingRocket.prototype.activate = function() {
    SpecialTile.prototype.activate.call(this);
    var tiles = this.root.find(ID.actual_tiles);
    this.target = tiles.getRocketTarget();
    console.log(this.target);
    this.getTurnInfo();
    tiles.launchHomingRocket(this.xCoordinate, this.yCoordinate);
    //play animation here
};

//play certain animations depending of turning and thrusting
HomingRocket.prototype.update = function(delta) {
    SpecialTile.prototype.update.call(this, delta);
    if (!this.thrusting && !this.turning) {
        this.playAnimation("idle");
        //else if thrusting (for stright line when going straight for target, velocity will need to accelerate to max too)
    } else if (this.turning) {
        this.rotation += this._rotationSpeed * delta;
        this._angle -= this._rotationSpeed * delta;
        if (this._angle <= 0) {
            this.parent.activeHomingRocket(this.xCoordinate, this.yCoordinate, this.getTimeToTarget());
            this.turning = false;
            this.thrusting = true;
        }

        //find if turning and which way and play appropriate animation for thrusters activating
    } else if (this.thrusting) {
        console.log("thrusting");
        this.playAnimation("idle"); //change to full thrust when made and rotate when I figure out how
        this.velocity.y += this._acceleration * this.yVelMult;
        this.velocity.x += this._acceleration * this.xVelMult;
    } //else if (this.exploding) {
    //this.playAnimation("exploding");
    //if (this.animationEnded()) {
    //this.deleteTile();
    //}
};

HomingRocket.prototype.draw = function() {
    this.sprite.draw(this.worldPosition, this.origin, this._sheetIndex, this.mirror, this.rotation);
};

//get the position and rotation needed to be pointing at the target
HomingRocket.prototype.getTurnInfo = function() {
    //var tiles = this.root.find(ID.actual_tiles);
    var rise = (this.target.position.y + this.target.origin.y) - (this.position.y + this.origin.y);
    var run = (this.target.position.x + this.target.origin.x) - (this.position.x + this.origin.x);
    if (rise < 0 && run <= 0) {
        console.log("trouble");
        this._angle = Math.atan2(rise, run);
    } else {
        this._angle = Math.atan2(rise, run);
    }
    console.log(this._angle);
    //assign rotation speed
    //assign max thrust x and y and initial velocities
    this._rotationSpeed = (this._angle / this._timeToTurn) * 1000; //radians per millisec
    this.xVelMult = Math.cos(this._angle); //speeds/angles for movement
    this.yVelMult = Math.sin(this._angle);
    this.turning = true;
};

//return a number of milliseconds it will take for the homing rocket to reach and blow up the target
HomingRocket.prototype.getTimeToTarget = function() {
    //based on starting point and target location
    let distance = Math.sqrt(Math.pow(Math.abs(this.target.position.x - this.position.x) * powerupjs.Canvas2D.scale.x, 2) + Math.pow(Math.abs(this.target.position.y - this.position.y) * powerupjs.Canvas2D.scale.y, 2));
    return Math.sqrt((distance * 2) / this._acceleration) * this.width * 1.4 * powerupjs.Canvas2D.scale.x; //do not change, this works for screen adjusting!
};

HomingRocket.prototype.explode = function() {
    this.exploding = true;
    this.thrusting = false;
    this.turning = false;
    this.rotation = 0; //may get rid of this to add some variety
    //play explodion animation here
    this.playAnimation("idle");
};