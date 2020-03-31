//JS File
"use strict";

//HorizontalLazer

function HorizontalLazer() {
    SpecialTile.call(this, 3);

    this.loadAnimation(sprites.lazer_horizontal, "idle", true);
    this.loadAnimation(sprites.horizontal_zap, "zap", false, 0.02);
    this.playAnimation("idle");
}
HorizontalLazer.prototype = Object.create(SpecialTile.prototype);

HorizontalLazer.prototype.activate = function() {
    SpecialTile.prototype.activate.call(this);
    var tiles = this.root.find(ID.actual_tiles);
    tiles.activeHorZap(this.xCoordinate, this.yCoordinate);
    this.playAnimation("zap");
};

HorizontalLazer.prototype.update = function(delta) {
    SpecialTile.prototype.update.call(this, delta);
};