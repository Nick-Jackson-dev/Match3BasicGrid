// JavaScript Document
"use strict";

//AnimatedGameObject inherits from powerupjs.SpriteGameobject
//this object will represent any gameobject that needs animation(s).
//the objet may walk, run, jump and so on. 
//powerupjs.AnimatedGameObject will store the different types of animations the object can perform and will store the current one it is performing

var powerupjs = (function(powerupjs) {
    function AnimatedGameObject(layer, id) {
        powerupjs.SpriteGameObject.call(this, null, layer, id);

        this._animations = {}; //holds the different animation types this object can have/perform
        this._current = null; //holds the current animation the object is undergoing
        this._time = 0;
    }
    AnimatedGameObject.prototype = Object.create(powerupjs.SpriteGameObject.prototype);

    //loadAnimation creates an animation to store in the _animations variable
    AnimatedGameObject.prototype.loadAnimation = function(animname, id, looping, frametime) {
        this._animations[id] = new powerupjs.Animation(animname, looping, frametime);
    };

    //playAnimation starts the specified animation. 
    //it passes the current sprite on the sprite sheet to the draw method
    AnimatedGameObject.prototype.playAnimation = function(id) {
        //if animation needed is already playing do nothing
        if (this._current === this._animations[id])
            return;
        //start at the first sprite in the sprite sheet, and at time of 0. set current to the inameiton to be played
        this._sheetIndex = 0;
        this._time = 0;
        this._current = this._animations[id]
            //set the spritemember to the sprite on the sheet that should be drawn
        this.sprite = this._current.sprite;
    };

    //returns a bool
    AnimatedGameObject.prototype.animationEnded = function() {
        return !this._current.looping && this.sheetIndex >= this.sprite.nrSheetElements - 1;
    };

    //update calculates which frame should be drawn
    AnimatedGameObject.prototype.update = function(delta) {
        this._time += delta;
        while (this._time > this._current.frameTime) {
            this._time -= this._current.frameTime;
            this._sheetIndex++;
            //loop
            if (this._sheetIndex >= this.sprite.nrSheetElements) {
                if (this._current.looping)
                    this._sheetIndex = 0;
                else
                    this._sheetIndex = this.sprite.nrSheetElements - 1;
            }
        }
        powerupjs.SpriteGameObject.prototype.update.call(this, delta);
    };

    powerupjs.AnimatedGameObject = AnimatedGameObject;
    return powerupjs;

})(powerupjs || {});