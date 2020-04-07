//JS File
"use strict";

//MultiTarget

function MultiTarget() {
    SpecialTile.call(this, 1);

    this.loadAnimation(sprites.multi_target, "idle", true);
    this.playAnimation("idle");

    this.targets = [];
}
MultiTarget.prototype = Object.create(SpecialTile.prototype);

MultiTarget.prototype.activate = function(basicType) {
    SpecialTile.prototype.activate.call(this);
    var randomBasic = Math.floor(Math.random() * 6);
    var basicType = typeof basicType != 'undefined' ? basicType : randomBasic;
    var tiles = this.root.find(ID.actual_tiles);
    this.targets = tiles.getMultiTargets(basicType);
    console.log(this.targets);
    setTimeout(function(tile) {
        for (let i = 0, l = tile.targets.length - 1; i <= l; i++) {
            tile.targets[i].deleteTile();
        }
        tile.deleteTile();
    }, 500, this);
};