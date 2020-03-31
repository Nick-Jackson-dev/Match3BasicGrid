//JS File
"use strict";

//VerticalLazer

function VerticalLazer() {
    SpecialTile.call(this, 2);

    this.loadAnimation(sprites.lazer_vertical, "idle", true);
    this.loadAnimation(sprites.horizontal_zap, "zap", false, 0.02);
    this.playAnimation("idle");
}
VerticalLazer.prototype = Object.create(SpecialTile.prototype);

VerticalLazer.prototype.activate = function() {
    SpecialTile.prototype.activate.call(this);
    var tiles = this.root.find(ID.actual_tiles);
    tiles.activeVerticalZap(this.xCoordinate, this.yCoordinate);
    this.playAnimation("zap");
};

VerticalLazer.prototype.update = function(delta) {
    SpecialTile.prototype.update.call(this, delta);
};