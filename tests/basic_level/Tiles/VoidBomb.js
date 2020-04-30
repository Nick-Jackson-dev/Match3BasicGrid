//JS File
"use strict";

//VoidBomb

function VoidBomb() {
    Tile.call(this);

    this.imploding = false;

    this.loadAnimation(sprites.void_bomb, "idle", true);
    this.loadAnimation(sprites.void_implosion, "implode", false, .025); //does not repeat, takes .525 seconds
    this.playAnimation("idle");
}
VoidBomb.prototype = Object.create(Tile.prototype);

VoidBomb.prototype.activate = function() {
    var tiles = this.root.find(ID.actual_tiles);
    this.imploding = true;
    tiles.activeVoidBomb(this.parent.xCoordinate, this.parent.yCoordinate);
};

VoidBomb.prototype.update = function(delta) {
    Tile.prototype.update.call(this, delta);
    if (this.imploding) {
        this.playAnimation("implode");
    }
};