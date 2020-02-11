# Match3BasicGrid
behavior of grid and tiles


General Goal: To get the basic behaviour of the match 3 mechanic down (see goal details after naming scheme). 
This is including:
  Tile behaviour, 
  Basic Level behaviors (score, timer, damage depending on level subclass),
  TileField behavior
  
  Naming Schemes
  Class names - will start with capital letter, no spaces/punctuation, each new word will have capital letter.
  Method names - will start with lowercase letter, no spaces/punctuation, each word (except the beginning) will start with uppercase.
  Member Variables - 2 types:
    1. Those that need to be altered elsewhere - will start with lowercase letter, no spaces/punctuation, each word (except the beginning) will start with uppercase.
    2. Those that are constant and should not be altered elsewhere - precede the name with an underscore (_)
       Note: to access these there may nee to be a get property for the membervariable (read only)
  Variables - will start with lowercase letter, no spaces/punctuation, each word (except the beginning) will start with uppercase.
  ID's - all lowercase, each word separated by an underscore (_) : IDs are used to access sprites, sounds, gamestates, and to find objects
  
Goal Details
  Level : a list of game objects (inherits from powerupjs.GameObjectList)
    Level Class - holds the tilefield (which holds the tiles), the quit button, settings button, the selection box (this may need to be moved to TileField)
    Level ill have some subclasses:
      TimeTrialLevel - For now it will hold a timer and a bar that depletes at a steady rate
                       Creating matches in teh TileField will increase the size of the bar.
                       Player wins if they last longer than the timer
                       Playerloses if the bar depletes completely before timer reaches 0
      EnduranceLevel - very similar but different (will describe in future edit)
      CombatLevel - this will be its own repository/project later
      ObjectiveLevel - this will be its own repository/project later 

  TileField: this is a list of game objects that displays them in a grid and said game objects can be accessed with indexes (inherits from powerupjs.GameObjectGrid)
    TileField should be loaded in Level class based on Level.levelData.tiles
    TileField should only hold Tile Objects 
    May be utilized to direct the behavior of the Tiles within it (see Tiles below)
    
  Tiles: only worrying about basic tiles in this repository. These are sprites (inheriting from powerupjs.SpriteGameObject) that hold a basic identifier based on the sprite.
    BasicTiles should fall if moveable (member variable) and if the space in the TileField under them is empty. 
    Falling should occur from the location of a basic tile generator (not yet implemented) (except at level load) when a match is made in order to fill in created gaps
      TileGenerator will be a class that will be added to the TileField using the tile system (ie it will be represented by a character in Level.levelData)
    Falling should be a transition not a teleportation (as it is in first commit)
    Tiles should fall straight down first to fill in spaces, then down at a 1:1 ratio to fill in diagonal if necessary (this is low priority for now)
    
Do not Do's:
  The powerupjs game engine (anything in the powerupjs directory) is meant to be vague and it is the backbone. it should not need to be edited much if at all
  If there is a functionality that is similar to what it provides that the game needs a new subclass can be made and hierarchy of anything related can be adjusted.
  If there is a change that would benefit a file in powerupjs, when you commit leave a very detailed reason as to why it is needed/why it will be beneficial

Things to Ignore:
  You may notice there is only one level and one tile setup but there is the backbone for automatic level selection - this can and cshould be gnored for now
  That is a project for another time.
   
