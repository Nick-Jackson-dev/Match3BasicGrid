"use strict";

//TilePair contains the tile and overlay pair
//inherits from powerupjs.GameObjectList
//entangels the two together
/*
var TileType = {
    background: 0,
    basic: 1,
    special: 2,
    empty: 4,
    deleted: 6
};
var OverlayType = {
    none: 0,
    vzap: 1,
    hzap: 2,
    retical: 3,
    rust: 4,
    ink: 5
};
var BasicID = {
    pink: 0,
    blue: 1,
    green: 2,
    orange: 3,
    red: 4,
    yellow: 5,
    random: 10 //undefined works too
};
var SpecialID = {
    multi: 1,
    bomb: 2,
    vline: 3,
    hline: 4
};*/

function TilePair(overlayType, type, tileID, layer, id) {
    layer = typeof layer != 'undefined' ? layer : ID.layer_tiles;
    powerupjs.GameObjectList.call(this, layer, id);
    //console.log("passed overlay: " + overlayType + " , passed type: " + type + " , passed ID: " + tileID);
    this.overlayType = overlayType;
    this.type = type;
    this.basicTileID = undefined;
    this.specialTileID = undefined;
    this.overlay = undefined;
    this.tile = undefined;
    if (this.type === TileType.basic) {
        this.basicTileID = tileID; //defaults to random
        if (this.basicTileID === BasicID.random) {
            this.basicTileID = Math.floor(Math.random() * 6);
        }
    } else if (this.type === TileType.special) {
        this.specialTileID = tileID;
    } else if (this.type === TileType.background) {
        this.basicTileID = 9; //will be invisible so sprite doesn't matter
    }
    //console.log("basic type: " + this.basicTileID + " , special type: " + this.specialTileID);
    this.initiate();
    //need to initialize based on parameters
}
TilePair.prototype = Object.create(powerupjs.GameObjectList.prototype);

TilePair.prototype.initiate = function() {
    this._tileSpeed = 475; // pixels/sec
    this.shift = 0;
    this.moveable = true;
    this.damageable = false;
    this.falling = false;
    //these next ones control the appropriate velocities for animation - they are implemetned in the update method but not working correctly
    this.shiftingRight = false;
    this.shiftingLeft = false;
    this.shiftingUp = false;
    this.shiftingDown = false;
    //assign the tile and the initial overlay
    //tile
    if (this.type === TileType.special) {
        if (this.specialTileID === SpecialID.multi) {
            this.tile = new MultiTarget();
        } else if (this.specialTileID === SpecialID.bomb) {
            this.tile = new VoidBomb();
        } else if (this.specialTileID === SpecialID.vline) {
            this.tile = new VerticalLazer();
        } else if (this.specialTileID === SpecialID.hline) {
            this.tile = new HorizontalLazer();
        }
    } else {
        this.tile = new BasicTile(this.basicTileID);
        //this may need expanded
    }
    this.add(this.tile);
    this.tile.position = powerupjs.Vector2.zero;
    //overlay
    if (this.overlayType === OverlayType.none) {
        this.overlay = new TileOverlay();
        //certain overlays will change this.moveable to false eventually
        //and this.damageable to true as well
    } else if (this.overlayType === OverlayType.rust) {
        this.overlay = new TileOverlay(OverlayType.rust);
        this.moveable = false;
    } else if (this.overlayType === OverlayType.ink) {
        this.overlay = new TileOverlay(OverlayType.ink);
        this.moveable = false;
    } else {
        this.overlay = new TileOverlay();
    }
    this.add(this.overlay);

    //link the two initially - need to link in update as well
    this.overlay.sisterTile = this.tile;
    this.tile.sisterOverlay = this.overlay;
    this.overlay.origin = this.tile.origin = new powerupjs.Vector2(this.tile.width / 2, this.tile.height / 2);
};

Object.defineProperty(TilePair.prototype, "tileSpeed", {
    get: function() {
        return this._tileSpeed;
    }
});

Object.defineProperty(TilePair.prototype, "xCoordinate", {
    get: function() {
        return this.parent.getTileXCoordinate(this);
    }
});

Object.defineProperty(TilePair.prototype, "yCoordinate", {
    get: function() {
        return this.parent.getTileYCoordinate(this);
    }
});

TilePair.prototype.beStill = function() {
    this.falling = false;
    this.shiftingRight = false;
    this.shiftingLeft = false;
    this.shiftingUp = false;
    this.shiftingDown = false;
    this.velocity = powerupjs.Vector2.zero;
};

//remove trickiness, delete basic or activate special (eventually) in that order
TilePair.prototype.deleteTile = function(nullifyScore, checkEffects) {
    nullifyScore = typeof nullifyScore != 'undefined' ? nullifyScore : false;
    checkEffects = typeof checkEffects != 'undefined' ? checkEffects : true;
    var tiles = this.root.find(ID.actual_tiles);
    //eventually want to do the removing of overlays based on type being TileType.tricky then call a function to figure out what to do based on overlay
    //then delete basic tiles if it isn't a tricky one
    //then activate special tiles if it isnt tricky or basic
    if (this.overlay.overlayType === OverlayType.rust) {
        if (!nullifyScore)
            this.removeRust(); // this could call just the TileOverlay.rustBust method later
    } else if (this.overlay.overlayType === OverlayType.ink) {
        if (!nullifyScore)
            this.removeInk(); // this could call just the TileOverlay.inkSquirt method later
    } else {
        this.type = TileType.deleted;
        if (checkEffects) {
            tiles.checkAdjacentEffects(this.xCoordinate, this.yCoordinate); //checks to see if a tile this one is touching when deleted should behave in a special way
        }
        if (!nullifyScore)
            this.root.tilesDestroyed += 1;
    }
    tiles.deselect();
};
//to remove rust the tile needs to be made moveable and then the overlay will have to take care of its part
TilePair.prototype.removeRust = function() {
    console.log("removing rust");
    this.overlay.rustBust();
};
//to remove ink the overlay will have to do its thing
TilePair.prototype.removeInk = function() {
    console.log("removing ink");
    this.overlay.inkSquirt();
};

TilePair.prototype.update = function(delta) {
    //the overlay and the tile graphics need to separate if the retical is travelling to it
    if (this.overlay.overlayType !== OverlayType.is_target) {
        this.tile.position = this.overlay.position = powerupjs.Vector2.zero;
    }
    powerupjs.GameObjectList.prototype.update.call(this, delta);
    if (!this.moveable) { // no updating position if not movable
        return;
    }
    if (!this.shiftingUp && !this.shiftingDown && !this.shiftingLeft && !this.shiftingRight) {
        this.velocity = powerupjs.Vector2.zero;
    }
    if (this.shiftingLeft) {
        this.velocity.x = -this.tileSpeed;
    }
    if (this.shiftingRight) {
        this.velocity.x = this.tileSpeed;
    }
    if (this.shiftingUp) {
        this.velocity.y = -this.tileSpeed;
    }
    if (this.shiftingDown) {
        this.velocity.y = this.tileSpeed;
    }
    if (this.falling) {
        this.velocity.y = this.tileSpeed;
    }
    //have velocityinfluence position over time - powerupjs.GameObjectList does not do this by default
    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;

};

TilePair.prototype.draw = function() {
    if (this.type === TileType.background || this.type === TileType.deleted || this.type === TileType.empty)
        return;
    powerupjs.GameObjectList.prototype.draw.call(this);
};

TilePair.prototype.activate = function(basicID) {
    basicID = typeof basicID != 'undefined' ? basicID : Math.floor(Math.random() * 6);
    //multi-target activation has parameters, others are independant; this handles that
    if (this.specialTileID === SpecialID.multi) {
        this.tile.activate(basicID);
    } else {
        this.tile.activate();
    }
};