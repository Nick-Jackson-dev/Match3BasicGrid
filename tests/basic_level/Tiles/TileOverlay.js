"use strict";

var OverlayType = {
    none: 0,
    vzap: 1,
    hzap: 2,
    retical: 3,
    rust: 4,
    ink: 5
};

//OverlayObject is an animated object that is statis but has many animations for different effects that take place over top of their sister tiles

function TileOverlay(overlayType, id) {
    powerupjs.AnimatedGameObject.call(this, ID.layer_tile_overlays, id);
    //load in overlay animations
    this.position = powerupjs.Vector2.zero;
    this.loadAnimation(sprites.overlay_none, "no_overlay", true, 0.05);
    this.loadAnimation(sprites.ink_squirt, "ink_active", true, 0.05);
    this.loadAnimation(sprites.rust_bust, "rust_active", true, 0.05)
    this.overlayType = typeof overlayType != 'undefined' ? overlayType : OverlayType.none;
    this.initiate();
}
TileOverlay.prototype = Object.create(powerupjs.AnimatedGameObject.prototype);

//looks at overlayType of the object and plays the appropriate animation and assigns variables
TileOverlay.prototype.initiate = function() {
    if (this.overlayType === OverlayType.none) {
        this.playAnimation("no_overlay");
    } else if (this.overlayType === OverlayType.ink) {
        this.playAnimation("ink_active");
    } else if (this.overlayType === OverlayType.rust) {
        this.playAnimation("rust_active");
    }
};

TileOverlay.prototype.update = function(delta) {
    powerupjs.AnimatedGameObject.prototype.update.call(this, delta);
};

TileOverlay.prototype.draw = function() {
    if (this.overlayType === OverlayType.none || !this.root.special)
        return;
    powerupjs.AnimatedGameObject.prototype.draw.call(this);
};