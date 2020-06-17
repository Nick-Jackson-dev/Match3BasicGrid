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

    //navigation in upper right for exit, settings and help
    this.settingsButton = new powerupjs.Button(sprites.temp_settings_button, ID.layer_objects_1);
    this.settingsButton.origin = new powerupjs.Vector2(this.settingsButton.width / 2, this.settingsButton.height / 2);
    this.settingsButton.position = new powerupjs.Vector2(1190, 30);
    this.add(this.settingsButton);
    this.helpButton = new powerupjs.Button(sprites.temp_help_button, ID.layer_objects_1);
    this.helpButton.origin = new powerupjs.Vector2(this.helpButton.width / 2, this.helpButton.height / 2);
    this.helpButton.position = new powerupjs.Vector2(1250, 30);
    this.add(this.helpButton);
    this.exitButton = new powerupjs.Button(sprites.temp_exit_button, ID.layer_objects_1);
    this.exitButton.origin = new powerupjs.Vector2(this.exitButton.width / 2, this.exitButton.height / 2);
    this.exitButton.position = new powerupjs.Vector2(1130, 30);
    this.add(this.exitButton);

    this.selectBorder = undefined;

    //background would normally load based on player location (upon going to level in the playingstate) based on the player location
    this.add(new powerupjs.SpriteGameObject(sprites.background_charybdo_treasure_cave, ID.layer_background));

    this.tileFieldHolder = new powerupjs.SpriteGameObject(sprites.background_standard_tile_field, ID.layer_background_1, ID.tile_field_holder);
    this.tileFieldHolder.origin = this.tileFieldHolder.center;
    this.tileFieldHolder.position = new powerupjs.Vector2(powerupjs.Game.size.x / 2, powerupjs.Game.size.y / 2);
    this.add(this.tileFieldHolder);
    this.tiles = new TileField(this.levelData.tiles.length, this.levelData.tiles[0].length, this.special, ID.layer_tiles, ID.actual_tiles);
    this.tiles.position = new powerupjs.Vector2(375, 94);
    this.tiles.cellWidth = 74;
    this.tiles.cellHeight = 74;
    this.add(this.tiles);

    this.selectBorder = new powerupjs.SpriteGameObject(sprites.selected_tile_overlay, ID.layer_overlays, ID.select_border);
    this.selectBorder.position = new powerupjs.Vector2(-2000, -2000);
    this.selectBorder.parent = this;
    this.add(this.selectBorder);

    this.reset();
}

Level.prototype = Object.create(powerupjs.GameObjectList.prototype);

Level.prototype.update = function(delta) {
    powerupjs.GameObjectList.prototype.update.call(this, delta);
    if (this.exitButton.pressed) {
        //go to settings/mainmenu
        powerupjs.GameStateManager.switchTo(ID.game_state_settings);
        console.log('exitting!');
    } else if (this.helpButton.pressed) {
        //goto help
        powerupjs.GameStateManager.switchTo(ID.game_state_help);
        console.log('Can I help you?');
    } else if (this.settingsButton.pressed) {
        //go to settings/main menu
        powerupjs.GameStateManager.switchTo(ID.game_state_settings);
        console.log('setting up are we?');
    }
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

Level.prototype.reset = function() {
    powerupjs.GameObjectList.prototype.reset.call(this);
    this.loadTiles();
};

//use tiles in level data to load the tilegrid
Level.prototype.loadTiles = function() {
    var done = false;
    //loading the tiles in the grid
    while (!done) {
        //done = true;
        //generates a board
        for (var y = 0, ly = this.tiles.rows; y < ly; ++y) {
            for (var x = 0, lx = this.tiles.columns; x < lx; ++x) {
                var t = this.loadTile(this.levelData.tiles[y][x], x, y); //(tile character, sheetindex(x), sheetindex (y))
                this.tiles.addAt(t, x, y);
            }
        }
        //reolve all matches upon loading
        console.log("starting to resolve matches");
        this.tiles.resolveMatches(true);
        console.log("matches resolved");
        //need to be able to make at least one move so find out if there are any moves
        console.log("now finding moves");
        this.tiles.findMoves(true);
        console.log("moves found");
        //end loop
        if (this.tiles.moves.length > 0) {
            console.log("good to go after loading all tiles");
            done = true;
        } else {
            console.log("not good to go after loading tiles");
        }
    }
};

//loadtile based on character
Level.prototype.loadTile = function(tileType, x, y) {
    console.log("loading a tile");
    switch (tileType) {
        case '?':
            return this.loadIndTile(OverlayType.none, TileType.basic, BasicID.random);
        case '0':
            return this.loadIndTile(OverlayType.none, TileType.basic, BasicID.pink);
        case '1':
            return this.loadIndTile(OverlayType.none, TileType.basic, BasicID.pink);
        case '2':
            return this.loadIndTile(OverlayType.none, TileType.basic, BasicID.green);
        case '3':
            return this.loadIndTile(OverlayType.none, TileType.basic, BasicID.orange);
        case '4':
            return this.loadIndTile(OverlayType.none, TileType.basic, BasicID.red);
        case '5':
            return this.loadIndTile(OverlayType.none, TileType.basic, BasicID.yellow);
        case 'b':
            return this.loadIndTile(OverlayType.none, TileType.special, SpecialID.bomb);
        case 'm':
            return this.loadIndTile(OverlayType.none, TileType.special, SpecialID.multi);
        case 'h':
            return this.loadIndTile(OverlayType.none, TileType.special, SpecialID.hline);
        case 'v':
            return this.loadIndTile(OverlayType.none, TileType.special, SpecialID.vline);
        case 'o':
            return this.loadIndTile(OverlayType.rust, TileType.basic, BasicID.random);
        case 'i':
            return this.loadIndTile(OverlayType.ink, TileType.basic, BasicID.random);
        default:
            return this.loadIndTile(OverlayType.none, TileType.basic, BasicID.random);
    }
};


Level.prototype.loadIndTile = function(overlayType, tileType, tileID) {
    overlayType = typeof overlayType != 'undefined' ? overlayType : OverlayType.none;
    tileType = typeof tileType != 'undefined' ? tileType : TileType.basic;
    tileID = typeof tileID != 'undefined' ? tileID : BasicID.random;
    var t = new TilePair(overlayType, tileType, tileID);
    return t;
};