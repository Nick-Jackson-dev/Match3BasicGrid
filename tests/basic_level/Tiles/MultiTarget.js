//JS File
"use strict";

//MultiTarget

function MultiTarget() {
    Tile.call(this);

    this.loadAnimation(sprites.multi_target, "idle", true);
    this.playAnimation("idle");

    this.targets = [];
}
MultiTarget.prototype = Object.create(Tile.prototype);

MultiTarget.prototype.activate = function(basicType) {
    var randomBasic = Math.floor(Math.random() * 6);
    var basicType = typeof basicType != 'undefined' ? basicType : randomBasic;
    var tiles = this.root.find(ID.actual_tiles);
    this.targets = tiles.getMultiTargets(basicType);
    console.log(this.targets);
    setTimeout(function(tilePair) {
        for (let i = 0, l = tilePair.tile.targets.length - 1; i <= l; i++) {
            let timer = (Math.random() * 400) + 250;
            //add a retical overlay on each target
            tilePair.tile.targets[i].overlay.isTargetOfMulti(tilePair.xCoordinate, tilePair.yCoordinate, timer); // need to have retical firing animation
            if (i === l) {
                setTimeout(function(tilePair) {
                    tilePair.deleteTile();
                    tilePair.parent.chainsLeft -= 1;
                    if (tilePair.parent.chainsLeft === 0) {
                        tilePair.parent.shiftTiles();
                    }
                }, 1200, tilePair);
            }
        }
    }, 200, this.parent);
};
//this will be implemented when TileType.tricky is implemented and TilePair.deleteTile is updated
/*MultiTarget.prototype.specialActivate(specialType) {
    var randomBasic = Math.floor(Math.random() * 6);
    var basicType = typeof basicType != 'undefined' ? basicType : randomBasic;
    var tiles = this.root.find(ID.actual_tiles);
    this.targets = tiles.getMultiTargets(basicType);
    console.log(this.targets);
    setTimeout(function(tilePair) {
        for (let i = 0, l = tilePair.tile.targets.length - 1; i <= l; i++) {
            let timer = (Math.random() * 400) + 250;
            //add a retical overlay on each target
            tilePair.tile.targets[i].overlay.isTargetOfMulti(tilePair.xCoordinate, tilePair.yCoordinate, timer); // need to have retical firing animation
            if (i === l) {
                setTimeout(function(tilePair) {
                    tilePair.deleteTile();
                    tilePair.parent.chainsLeft -= 1;
                    if (tilePair.parent.chainsLeft === 0) {
                        tilePair.parent.shiftTiles();
                    }
                }, 1200, tilePair);
            }
        }
    }, 200, this.parent);*/
/*for (let i = 0, l = targets.length - 1; i < l; i++) {
        this.chainsLeft += 1;
        let timer = Math.random() * 1000;
        let x = targets[i].xCoordinate,
            y = targets[i].yCoordinate;

        setTimeout(function(tiles, x, y) {
            tiles.at(x, y).deleteTile(true);
            tiles.addAt(new TilePair(OverlayType.is_target, TileType.special, SpecialID.bomb), x, y);
            tiles.at(x, y).activate();
        }, timer, this, x, y); //timer should be variable
    }
    //delete the mixed ones
    setTimeout(function(tiles, source, nonsource) {
        tiles.chainsLeft -= 1;
        source.deleteTile();
        nonsource.deleteTile();
        if (tiles.chainsLeft === 0) {
            tiles.shiftTiles();
        }
    }, 500, this, source, nonsource);

};*/