// JavaScript Document

"use strict";


//testingbasiclevelstate loads the level
//preliminary to playing state , though playing state should not be IGameLoopObject - at elast I dont think
//playing state would be passed shared levels and a difficulty

function TestingBasicLevelState() {
    powerupjs.IGameLoopObject.call(this);

    this.currentLevel = undefined;
    this.currentLevelIndex = undefined;
    //this.difficulty = difficulty;
    //would store planet and planet state here
    //this.planet = planet
    //this.visited = visited or if undefined
    //this.complete = complete or if undefined false

    //default levels should be loaded
    //this._defaultLevels = [];
    //this._defaultLevels = defaultLevels;
    //this.loadDefaultLevels(_defaultLevels);

    this.allPlanetLevels = ID.standardTestLevel;

    //levelArrays for each type of level, each would have its own method for loading that type of level - this would normally be in begin method upon actually visiting the planet
    this.timeTrialLevels = [];
    this.enduranceLevels = [];
    this.objectiveLevels = [];
    this.combatLevels = [];

    this.loadLevels();

    this.goToLevel(this.timeTrialLevels)
}

TestingBasicLevelState.prototype = Object.create(powerupjs.IGameLoopObject.prototype);

TestingBasicLevelState.prototype.loadLevels = function() {
    for (var i = 0, l = this.allPlanetLevels.length; i < l; i++) {
        if (this.allPlanetLevels[i]._timeTrialLevel)
            this.timeTrialLevels.push(new Level(this.allPlanetLevels[i]));
    }
    //would do the same with default levels
    //do the same with ither level types
};

//need a FindAppropriateLevels method that searches the this.levels array to match up the planets levels with certain criteria of the playthrough such as location and prevlocation and the state the player is in (hosite) would then store those indexes of approprite levels in an array and pass the array to SelectLevel which would select the level to go to returns Selectlevel
TestingBasicLevelState.prototype.findAppropriateLevels = function(levelArray) {
    var defaultIndexList = [];
    //var genericLevels = []
    //var appropriateLevels = [];
    //var sequencedLevels = [];
    //var player = this.root.find(ID.player);
    //for(var i = 0, l = levelArray.length; i < l; i++) {
    //check if a sequenced level exists, if so add to sequenced levels and continue
    //if(this.levels[i].prevLocation == player.prevLocation && this.levels[i].location == player.location) { // will need player state as well eventually
    //sequencedLevels.push(i);
    //contnue;
    //}
    //else if(there may be a way to search for other things what would make the levels appropriate later){
    //appropriateLevels.push(i);
    //continue;
    //}
    //else if(search for levels with generic as the location) 
    //add then to generic level array
    //}
    //if(sequencedLevels.length !== 0) {
    //return this.SelectLevel(levelArray, sequencedLevels);
    //} //else if (appropriateLevels.length !== 0) {
    //return this.SelectLevel(levelArray, appropriateLevels)
    //} else {
    //generic
    //}
    for (var i = 0, l = levelArray.length; i < l; i++)
        defaultIndexList.push(i);
    return this.selectLevel(levelArray, defaultIndexList); //catch-all
};

//need a SelectLevel method that would take an array of levels and randomly select based on probabilities based on the difficulty chosen and the data from t the levels in the array (whether the level is a hard/easy level) returns a level in the levels array
TestingBasicLevelState.prototype.selectLevel = function(levelsArray, indexList) {
    //this is the generic no this.difficulty defined code
    var indexListIndex = Math.floor(Math.random() * indexList.length);
    var levelIndex = indexList[indexListIndex];
    console.log(levelsArray[levelIndex]);
    return levelIndex;
};

//normally goTolevel would be called with a prevlocation and location (and maybe a type based on hostility from dialogue trees) and search the level list for sequential levels
//upon finding many it would randomize, upon finding none it would match location and randomize the allowed levels, upon finding none it would randomize shared levels
TestingBasicLevelState.prototype.goToLevel = function(levelArray) {
    this.currentLevelIndex = this.findAppropriateLevels(levelArray);
    this.currentLevel = levelArray[this.currentLevelIndex];
    this.currentLevel.reset();
};

TestingBasicLevelState.prototype.handleInput = function(delta) {
    this.currentLevel.handleInput(delta);
};

TestingBasicLevelState.prototype.update = function(delta) {
    this.currentLevel.update(delta);
};

TestingBasicLevelState.prototype.draw = function() {
    this.currentLevel.draw();
};