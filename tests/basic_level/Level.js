// JavaScript Document
"use strict"

//level loads and draws the tiles of the level and any pertinant information
//holds a lot of information so inherits from powerupjs.GameObjectList
//holds the tilegrid, the background, also is generic for a level type since specific leveltypes inherit from it


function Level(levelData, special) {
    powerupjs.GameObjectList.call(this);

    this.levelData = levelData;
    this.playerData = undefined; //will look for player and use player data to display the player sprite and active/passive inventory
    this.objectiveData = undefined; //certain levels will use this and it will be retrieved from level data - may not be necessary

    this.special = typeof special !== 'undefined' ? this.special : true;
    this.showMoves = false;
    this.dragging = false;

    this.cornerNav = undefined; //will hold the buttons for settings, exits, and help
    this.selectBorder = undefined;

    //background would normally load based on player location (upon going to level in the playingstate) based on the player location
    this.add(new powerupjs.SpriteGameObject(sprites.background_charybdo_treasure_cave, ID.layer_background));

    this.tileFieldHolder = new powerupjs.SpriteGameObject(sprites.background_standard_tile_field, ID.layer_background_1, ID.tile_field_holder);
    this.tileFieldHolder.origin = this.tileFieldHolder.center;
    this.tileFieldHolder.position = new powerupjs.Vector2(powerupjs.Game.size.x / 2, powerupjs.Game.size.y / 2);
    this.add(this.tileFieldHolder);

    this.loadTiles();
}

Level.prototype = Object.create(powerupjs.GameObjectList.prototype);

Level.prototype.update = function(delta) {
    powerupjs.GameObjectList.prototype.update.call(this, delta);
};

Level.prototype.handleInput = function(delta) {
    powerupjs.GameObjectList.prototype.handleInput.call(this, delta);

    if (powerupjs.Touch.isTouchDevice) {
        this.handleTouchInput(delta);
    } else {
        this.handleComputerInput(delta);
    }
};


Level.prototype.handleComputerInput = function(delta) {
    //do something using powerupjs.Keyboard or rather powerupjs.Mouse
};

Level.prototype.handleTouchInput = function(delta) {
    //do something using powerupjs.Touch
};


//use tiles in level data to load the tilegrid
Level.prototype.loadTiles = function() {
    this.tiles = new TileField(this.levelData.tiles.length, this.levelData.tiles[0].length, this.special, ID.tiles);
    this.tiles.position = new powerupjs.Vector2(342, 61);
    this.add(this.tiles);
    this.selectBorder = new powerupjs.SpriteGameObject(sprites.selected_tile_overlay, ID.layer_overlays, ID.select_border);
    this.selectBorder.position = new powerupjs.Vector2(-2000, -2000);
    this.selectBorder.parent = this;
    this.add(this.selectBorder);
    var done = false;

    this.tiles.cellWidth = 74;
    this.tiles.cellHeight = 74;
    //loading the tiles in the grid
    while (!done) {
        //generates a board
        for (var y = 0, ly = this.tiles.rows; y < ly; ++y) {
            for (var x = 0, lx = this.tiles.columns; x < lx; ++x) {
                var t = this.loadTile(this.levelData.tiles[y][x], x, y); //(tile character, sheetindex(x), sheetindex (y))
                this.tiles.addAt(t, x, y);
            }
        }
        //reolve all matches upon loading
        this.tiles.resolveMatches();
        //need to be able to make at least one move so find out if there are any moves
        this.tiles.findMoves();
        //end loop
        if (this.tiles.moves.length > 0) {
            done = true;
        }
    }
};

//loadtile based on character
Level.prototype.loadTile = function(tileType, x, y) {
    switch (tileType) {
        case '?':
            console.log("added basic type");
            return this.loadBasicTile(TileType.basic);
        default:
            return this.loadBasicTile(TileType.background);
    }
};


Level.prototype.loadBasicTile = function(tileType) {
    var t = new BasicTile(tileType);
    return t;
};