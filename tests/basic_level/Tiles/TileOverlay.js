"use strict";

var OverlayType = {
    none: 0,
    vzap: 1,
    hzap: 2,
    retical: 3,
    rust: 4,
    ink: 5,
    rust_bust: 6,
    ink_squirt: 7,
    is_target: 8
};

//OverlayObject is an animated object that is statis but has many animations for different effects that take place over top of their sister tiles

function TileOverlay(overlayType, id) {
    powerupjs.AnimatedGameObject.call(this, ID.layer_tile_overlays, id);
    //load in overlay animations
    this.position = powerupjs.Vector2.zero;
    //static "animations"
    this.loadAnimation(sprites.overlay_none, "no_overlay", true);
    this.loadAnimation(sprites.rust_init, "rust_initial", true);
    this.loadAnimation(sprites.ink_init, "ink_initial", true);
    this.loadAnimation(sprites.multi_target, "is_target", true);
    //active animations
    this.loadAnimation(sprites.horizontal_zap, "horizontal_zap", false, 0.02);
    this.loadAnimation(sprites.vertical_zap, "vertical_zap", false, 0.02);
    this.loadAnimation(sprites.ink_squirt, "ink_active", false, 0.025);
    this.loadAnimation(sprites.rust_bust, "rust_active", false, 0.05)
    this.overlayType = typeof overlayType != 'undefined' ? overlayType : OverlayType.none;
    this.initiate();
}
TileOverlay.prototype = Object.create(powerupjs.AnimatedGameObject.prototype);

//looks at overlayType of the object and plays the appropriate animation and assigns variables
TileOverlay.prototype.initiate = function() {
    if (this.overlayType === OverlayType.none) {
        this.playAnimation("no_overlay");
    } else if (this.overlayType === OverlayType.ink) {
        this.playAnimation("ink_initial");
    } else if (this.overlayType === OverlayType.rust) {
        this.playAnimation("rust_initial");
    }
};

//handles starting animations based on overlay type
TileOverlay.prototype.update = function(delta) {
    powerupjs.AnimatedGameObject.prototype.update.call(this, delta);
    if (this.overlayType === OverlayType.vzap && this.animationEnded() && this.parent.type !== TileType.deleted) {
        this.playAnimation("vertical_zap");
        this.parent.deleteTile();
    } else if (this.overlayType === OverlayType.hzap && this.animationEnded() && this.parent.type !== TileType.deleted) {
        this.parent.deleteTile();
    } else if ((this.overlayType === OverlayType.rust_bust || this.overlayType === OverlayType.ink_squirt) && this.animationEnded()) {
        this.parent.moveable = true;
        this.playAnimation("no_overlay");
        this.overlayType = OverlayType.none
    } else if (this.overlayType === OverlayType.none) {
        this.playAnimation("no_overlay");
    }
};

TileOverlay.prototype.draw = function() {
    if (this.overlayType === OverlayType.none || !this.root.special)
        return;
    powerupjs.AnimatedGameObject.prototype.draw.call(this);
};

TileOverlay.prototype.horizontalZapActivate = function() {
    if (this.overlayType === OverlayType.none) {
        this.overlayType = OverlayType.hzap;
        this.playAnimation("horizontal_zap");
    } else {
        this.parent.deleteTile();
    }
};
TileOverlay.prototype.verticalZapActivate = function() {
    if (this.overlayType === OverlayType.none) {
        this.overlayType = OverlayType.vzap;
        this.playAnimation("vertical_zap");
    } else {
        this.parent.deleteTile();
    }
};

TileOverlay.prototype.isTargetOfMulti = function(multiX, multiY, timer) {
    //get the distance to the multi target set initial position of retical, do setTimeout for velocity to change based on that distance and the direction.
    //velocity should be faster for further targets and the retical should arrive at this tilepair position just before the tile disappears,
    //when it arrives the shooting animation should happen as the tile gets deleted (the tile is deleted at the milliseconds passed as timer parameter)
    if (this.overlayType === OverlayType.none) {
        this.overlayType = OverlayType.is_target;
    }
    this.playAnimation("is_target"); // retical overlay
    var tiles = this.root.find(ID.actual_tiles);
    var multi = tiles.at(multiX, multiY); //getting the multi-target on tilefield that activated - not sure if it would be cheaper to pass it instead
    var timer = typeof timer != 'undefined' ? timer : (Math.random() * 400) + 250; //ms

    var positionDiffV = new powerupjs.Vector2(multi.position.x - this.parent.position.x, multi.position.y - this.parent.position.y); //overlay must start at the position of the multi-target
    var distance = Math.sqrt(Math.pow(Math.abs(positionDiffV.x), 2) + Math.pow(Math.abs(positionDiffV.y), 2));
    this.position = positionDiffV;
    var rise = (this.sisterTile.position.y) - (this.position.y);
    var run = (this.sisterTile.position.x) - (this.position.x);
    var angle = Math.atan2(rise, run);
    this.velocity.x = 1000 * (Math.cos(angle) * distance) / timer;
    this.velocity.y = 1000 * (Math.sin(angle) * distance) / timer;
    console.log(this.velocity);
    console.log(angle);
    setTimeout(function(overlay) {
        overlay.velocity = new powerupjs.Vector2(0, 0);
        setTimeout(function(overlay) {
            overlay.parent.deleteTile();
        }, 500, overlay)
    }, timer, this);
};
//for rustBust method the overlaytype will have to change to rustBust and the rust_active animation will play 
//then in update once the animation is over the overlay will need made OverlayType.none and animation to be no-overlay
TileOverlay.prototype.rustBust = function() {
    this.overlayType = OverlayType.rust_bust;
    this.playAnimation("rust_active");
};

TileOverlay.prototype.inkSquirt = function() {
    this.overlayType = OverlayType.ink_squirt;
    this.playAnimation("ink_active");
};