// JavaScript Document
"use strict";

//Animation assumes a sprtie sheet of sequenctial sprites (representing frames) that will make up an animation
//needs to know how long the frames of the animaltion need to be on screen beore mocing to the next.
//needs to know whether the animation is one that should loop

var powerupjs = (function (powerupjs) {
	function Animation (sprite, looping, frameTime) {
		this.sprite = sprite; 
		this.frameTime = typeof frameTime !== 'undefined' ? frameTime : 0.1;
		this.looping = looping;
	}
	
	powerupjs.Animation = Animation;
	return powerupjs;
	
})(powerupjs || {});

