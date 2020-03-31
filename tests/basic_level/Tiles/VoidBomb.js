//JS File
"use strict";

//VoidBomb

function VoidBomb() {
    SpecialTile.call(this, 5);

    this.imploding = false;

    this.loadAnimation(sprites.void_bomb, "idle", true);
    this.loadAnimation(sprites.void_implosion, "implode", false, .025); //does not repeat, takes .525 seconds
    this.playAnimation("idle");
}
VoidBomb.prototype = Object.create(SpecialTile.prototype);

VoidBomb.prototype.activate = function() {
    SpecialTile.prototype.activate.call(this);
    var tiles = this.root.find(ID.actual_tiles);
    this.imploding = true;
    tiles.activeVoidBomb(this.xCoordinate, this.yCoordinate);
};

VoidBomb.prototype.update = function(delta) {
    SpecialTile.prototype.update.call(this, delta);
    if (this.imploding) {
        this.playAnimation("implode");
    }
};