//JS file
"use strict"

//TimeTrialLevel inherits from Level.
//goal is to fill up the bar by making matches
//in addition to what Level holds this: holds a bar that depletes overtime and gets added to upon matching.
//holds a timer - if the timer runs out the player loses

function TimeTrialLevel(levelData) {
    Level.call(this, levelData, false);

    this.progressBar = new ProgressBar(); //(beginning position, start position, rate of depletion modifier, rate of increase modifier) - modifiers from playerData
    this.add(this.progressBar);

    this.tilesDestroyed = 0;

    this.timer = new CountDownTimer(120); //(startTime)
    this.add(this.timer);
}
TimeTrialLevel.prototype = Object.create(Level.prototype);

TimeTrialLevel.prototype.update = function(delta) {
    Level.prototype.update.call(this, delta);
    if (this.tilesDestroyed > 0) {
        for (let i = 0, l = this.tilesDestroyed; i < l; i++) {
            this.progressBar.fillUp();
            this.tilesDestroyed--;
        }
    }
};