//JS file
"use strict"

//TimeTrialLevel inherits from Level.
//goal is to fill up the bar by making matches
//in addition to what Level holds this: holds a bar that depletes overtime and gets added to upon matching.
//holds a timer - if the timer runs out the player loses

function TimeTrialLevel(levelData) {
    Level.call(this, levelData, false);
    
    //var progressBar = new ProgressBar();//(beginning position, start position, rate of depletion modifier, rate of increase modifier) - modifiers from playerData

    //this.timer = new Timer();//(startTime)
}
TimeTrialLevel.prototype = Object.create(Level.prototype);