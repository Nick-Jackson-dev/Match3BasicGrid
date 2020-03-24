//JS File
"use strict";

//VoidBomb

function VoidBomb() {
    SpecialTile.call(this, 5);

    this.imploding = false;

    this.loadAnimation(sprites.void_bomb, "idle", true);
    this.loadAnimation(sprites.void_implostion, 'implode', false, .05); //does not repeat
    this.playAnimation("idle");
}
VoidBomb.prototype = Object.create(SpecialTile.prototype);

VoidBomb.prototype.activate = function() {
    SpecialTile.prototype.activate.call(this);
    this.imploding = true;
    this.playAnimation("implode");
};

VoidBomb.prototype.update = function(delta) {
    SpecialTile.prototype.update.call(this, delta);
    if (this.imploding && this.animationEnded) {
        this.imploding = false;
        this.deleteTile();
    }
};