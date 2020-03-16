//JS file

"use strict";

//progressbar is a vertical rectagle that has an origin in its bottom left. and grows upward and shrinks downward based on its height
//maxheight is always the same but the height is affected by the player scoring. 
//depletes overtime at a standard rate that is affected by the players buffs
//inherits from powerupjs.GameObject

function ProgressBar() {
    powerupjs.GameObject.call(this, ID.layer_overlays_2, ID.progress_bar);
    this._width = 50;
    this._maxHeight = -575;
    this._x = 1080;
    this._y = 640;
    this.position = new powerupjs.Vector2(this._x, this._y);
    this.origin = this._position;
    this._maxDepletionRate = -18.3;
    this.reset();
}

ProgressBar.prototype = Object.create(powerupjs.GameObject.prototype);

Object.defineProperty(ProgressBar.prototype, "maxHeight", {
    get: function() {
        return this._maxHeight;
    }
});

Object.defineProperty(ProgressBar.prototype, "depletionRate", {
    get: function() {
        return this._depletionRate;
    }
});

Object.defineProperty(ProgressBar.prototype, "gameOver", {
    get: function() {
        return this.height <= this._maxHeight || this.height >= 0;
    }
});

Object.defineProperty(ProgressBar.prototype, "winLevel", {
    get: function() {
        return this.height <= this._maxHeight; //returning false after game is ProgressBar.gameOver means losing the level
    }
});

ProgressBar.prototype.reset = function() {
    powerupjs.GameObject.prototype.reset.call(this);
    this.height = this.getInitialHeight(); //finds what initial height should be - based on player buffs
    this._depletionRate = this.getDepletionRate(); //gets depletion rate based on player buffs
    this._fillRate = this.getFillRate();
    this.fillAmount = 0;
    this.filling = false;
    this._empty = false;
    this._full = false;
};

ProgressBar.prototype.getInitialHeight = function() {
    //let player = this.root.find(ID.player);
    let defaultHeight = this.maxHeight / 2.12;
    //let difficultyEffect = undefined;
    //let Playereffect = player.progressBarHeightEffect; //this is a decimal ie a percentage based on player items
    let playerEffect = 1; //higher effects make it easier
    let difficultyEffect = 1;
    return defaultHeight * playerEffect * difficultyEffect;
};

ProgressBar.prototype.getDepletionRate = function() {
    //let player = this.root.find(ID.player);
    let defaultDepletion = -14;
    //let difficultyEffect = undefined;
    //let Playereffect = player.progressBarDepletionEffect; //this is a decimal ie a percentage based on player items
    let playerEffect = 1; //higher effects make it harder
    let difficultyEffect = 1;
    this._maxDepletionRate *= difficultyEffect;
    return defaultDepletion * playerEffect * difficultyEffect;
};

ProgressBar.prototype.getFillRate = function() {
    //let player = this.root.find(ID.player);
    let defaultFill = -22;
    //let Playereffect = player.progressBarFillEffect; //this is a decimal ie a percentage based on player items
    //let difficultyEffect = undefined;
    let playerEffect = 1; //higher effects make it easier
    let difficultyEffect = 1;
    return defaultFill * playerEffect * difficultyEffect;
};

//called
ProgressBar.prototype.fillUp = function() {
    this.filling = true;
    this.fillAmount += 1;
};

//if the bar is full or empty then it is a win or loss respectively
//if the bar is filling the height grows, if it is not the height shrinks
//keep in mind positive height is downward
ProgressBar.prototype.update = function(delta) {
    powerupjs.GameObject.prototype.update.call(this, delta);
    if (this.height <= this.maxHeight) {
        this.height = this.maxHeight;
        this._full = true;
        return;
    } else if (this.height >= 0) {
        this.height = 0;
        this._empty = true;
        return;
    }
    if (this.filling) {
        //console.log(this.fillAmount);
        if (this.fillAmount <= 0) {
            //console.log('changing to depleting');
            this.fillAmount = 0;
            this.filling = false;
        } else {
            this.height += this._fillRate * this.fillAmount * delta;
            this.fillAmount -= 6 * delta;
        }
    }
    //console.log("depleting");
    this._depletionRate -= 0.002; //get faster the longer player is on level
    if (this._depletionRate < this._maxDepletionRate) {
        //maxes out at around 40 seconds (from default timer on normal difficulty)
        this._depletionRate = this._maxDepletionRate;
    }
    this.height -= this._depletionRate * delta;
};

ProgressBar.prototype.draw = function() {
    powerupjs.Canvas2D.drawFilledRectangle(this._x, this._y, this._width, this.height, powerupjs.Color.sandyBrown);
};