//JS File
"use strict";

//VoidBomb

function VoidBomb() {
    SpecialTile.call(this, 5);

    this.loadAnimation(sprites.void_bomb, "idle", true);
    this.playAnimation("idle");
}
VoidBomb.prototype = Object.create(SpecialTile.prototype);