//JS File
"use strict";

//VerticalLazer

function VerticalLazer() {
    Tile.call(this);

    this.loadAnimation(sprites.lazer_vertical, "idle", true);
    //this.loadAnimation(sprites.vertical_zap, "zap", false, 0.02);
    this.playAnimation("idle");
}
VerticalLazer.prototype = Object.create(Tile.prototype);

VerticalLazer.prototype.activate = function() {
    var tiles = this.root.find(ID.actual_tiles);
    tiles.activeVerticalZap(this.parent.xCoordinate, this.parent.yCoordinate);
    this.sisterOverlay.verticalZapActivate();
};

VerticalLazer.prototype.update = function(delta) {
    Tile.prototype.update.call(this, delta);
};