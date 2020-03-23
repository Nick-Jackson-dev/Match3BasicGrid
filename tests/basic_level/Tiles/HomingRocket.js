//JS File
"use strict";

//HomingRocket

function HomingRocket() {
    SpecialTile.call(this, 4);

    this.loadAnimation(sprites.homing_rocket, "idle", true);
    this.playAnimation("idle");
}
HomingRocket.prototype = Object.create(SpecialTile.prototype);