//JS File
"use strict";

//HorizontalLazer

function HorizontalLazer() {
    Tile.call(this);

    this.loadAnimation(sprites.lazer_horizontal, "idle", true);
    //this.loadAnimation(sprites.horizontal_zap, "zap", false, 0.02);
    this.playAnimation("idle");
}
HorizontalLazer.prototype = Object.create(Tile.prototype);

HorizontalLazer.prototype.activate = function() {
    var tiles = this.root.find(ID.actual_tiles);
    tiles.activeHorZap(this.parent.xCoordinate, this.parent.yCoordinate);
    this.sisterOverlay.horizontalZapActivate();
};

HorizontalLazer.prototype.update = function(delta) {
    Tile.prototype.update.call(this, delta);
};