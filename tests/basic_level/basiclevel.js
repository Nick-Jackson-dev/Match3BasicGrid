<<<<<<< HEAD
"use strict";

var ID = {};
var sprites = {};
var sounds = {};

var GameSettings = {
    hints: true
};

powerupjs.Game.loadAssets = function () {
    var loadSprite = function (sprite) {
        return new powerupjs.SpriteSheet("../../assets/sprites/" + sprite);
    };
	var loadBackgroundSprite = function (sprite) { // assumes a .jpg file
        return new powerupjs.SpriteSheet("../../assets/sprites/backgrounds/" + sprite + ".jpg");
    };

    var loadSound = function (sound, looping) {
        return new powerupjs.Sound("../../assets/sounds/" + sound, looping);
    };

	//background sprites
   // sprites.background_title = loadSprite("backgrounds/spr_title.jpg");
	sprites.background_charybdo_treasure_cave = loadBackgroundSprite("charybdo/spr_treasure_cave");
	
	sprites.background_standard_tile_field = loadSprite("levels/standardTileBoard.png");
	
	//object sprites
	sprites.basic_blue = loadSprite("tiles/basic_blue.png");
	sprites.basic_red = loadSprite("tiles/basic_red.png");
	sprites.basic_orange = loadSprite("tiles/basic_orange.png");
	sprites.basic_green = loadSprite("tiles/basic_green.png");
	sprites.basic_yellow = loadSprite("tiles/basic_yellow.png");
	sprites.lazer = loadSprite("tiles/lazer.png");
	
	sprites.selected_tile_overlay = loadSprite("levels/selected_tile_overlay.png");
	
	//player sounds
	
	//other sounds
	
	//levels - *works
	ID.standardTestLevel = standardlevels;
	
	console.log("all assets loaded");
};

powerupjs.Game.initialize = function () {
    // play the music
	//sounds.music.volume = 0.3;
	//sounds.music.play();
	console.log("initializing");
    // define the layers
    ID.layer_background = 1;
    ID.layer_background_1 = 2;
    ID.layer_background_2 = 3;
    ID.layer_background_3 = 4;
    ID.layer_tiles = 10;
    ID.layer_objects = 20;
    ID.layer_objects_1 = 21;
    ID.layer_objects_2 = 22;
    ID.layer_overlays = 30;
    ID.layer_overlays_1 = 31;
    ID.layer_overlays_2 = 32;

    // define object IDs
	ID.player = 1;
	ID.tiles = 2;
	ID.selected_tile = 3;
    ID.select_border = 4;
    ID.tile_field_holder = 5;
    // create the different game states
    //ID.game_state_title = powerupjs.GameStateManager.add(new TitleMenuState());
    //ID.game_state_help = powerupjs.GameStateManager.add(new HelpState());
    //ID.game_state_playing = powerupjs.GameStateManager.add(new PlayingState());
	ID.game_state_basiclevel_test = powerupjs.GameStateManager.add(new TestingBasicLevelState());

    // set the current game mode
    powerupjs.GameStateManager.switchTo(ID.game_state_basiclevel_test);
	console.log("initialized");
=======
"use strict";

var ID = {};
var sprites = {};
var sounds = {};

var GameSettings = {
    hints: true
};

powerupjs.Game.loadAssets = function () {
    var loadSprite = function (sprite) {
        return new powerupjs.SpriteSheet("../../assets/sprites/" + sprite);
    };
	var loadBackgroundSprite = function (sprite) { // assumes a .jpg file
        return new powerupjs.SpriteSheet("../../assets/sprites/backgrounds/" + sprite + ".jpg");
    };

    var loadSound = function (sound, looping) {
        return new powerupjs.Sound("../../assets/sounds/" + sound, looping);
    };

	//background sprites
   // sprites.background_title = loadSprite("backgrounds/spr_title.jpg");
	sprites.background_charybdo_treasure_cave = loadBackgroundSprite("charybdo/spr_treasure_cave");
	
	sprites.background_standard_tile_field = loadSprite("levels/standardTileBoard.png");
	
	//object sprites
	sprites.basic_blue = loadSprite("tiles/basic_blue.png");
	sprites.basic_red = loadSprite("tiles/basic_red.png");
	sprites.basic_orange = loadSprite("tiles/basic_orange.png");
	sprites.basic_green = loadSprite("tiles/basic_green.png");
	sprites.basic_yellow = loadSprite("tiles/basic_yellow.png");
	sprites.lazer = loadSprite("tiles/lazer.png");
	
	sprites.selected_tile_overlay = loadSprite("levels/selected_tile_overlay.png");
	
	//player sounds
	
	//other sounds
	
	//levels - *works
	ID.standardTestLevel = standardlevels;
	
	console.log("all assets loaded");
};

powerupjs.Game.initialize = function () {
    // play the music
	//sounds.music.volume = 0.3;
	//sounds.music.play();
	console.log("initializing");
    // define the layers
    ID.layer_background = 1;
    ID.layer_background_1 = 2;
    ID.layer_background_2 = 3;
    ID.layer_background_3 = 4;
    ID.layer_tiles = 10;
    ID.layer_objects = 20;
    ID.layer_objects_1 = 21;
    ID.layer_objects_2 = 22;
    ID.layer_overlays = 30;
    ID.layer_overlays_1 = 31;
    ID.layer_overlays_2 = 32;

    // define object IDs
	ID.player = 1;
	ID.tiles = 2;
	ID.selected = 3;
	ID.selectBorder = 4;
    // create the different game states
    //ID.game_state_title = powerupjs.GameStateManager.add(new TitleMenuState());
    //ID.game_state_help = powerupjs.GameStateManager.add(new HelpState());
    //ID.game_state_playing = powerupjs.GameStateManager.add(new PlayingState());
	ID.game_state_basiclevel_test = powerupjs.GameStateManager.add(new TestingBasicLevelState());

    // set the current game mode
    powerupjs.GameStateManager.switchTo(ID.game_state_basiclevel_test);
	console.log("initialized");
>>>>>>> e8388c9fe7756dad0f06205ec6b57f6a926f2041
};