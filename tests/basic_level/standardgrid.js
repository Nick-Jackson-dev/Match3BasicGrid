/*LEGEND
'.' = background/transparent tile
'?' = random basic tile from sheet_index 0 to 4
'b' = VoidBomb
'h' = HorizontalLazer
'v' = VertaicalLazer
'm' = MultiTarget
'r' = HomingRocket - NOT TO BE USED
'0' = pink basic
'1' = blue basic
'2' = green basic
'3' = orange basic
'4' = red basic
'5' = yellow basic
'o' = random basic rusty tile (o for oxidized)
'i' = random basic inky tile
*/

var standardlevels = [];

//timetrial

//endurance

//test
standardlevels.push({
    _timeTrialLevel: true,
    _enduranceLevel: false,
    _objectiveLevel: false,
    _combatLevel: false,
    _planet: 'charybdo',
    _prevLocation: 'test0',
    _location: 'test1',
    _difficulty: undefined,
    tiles: [
        "????????",
        "????????",
        "????????",
        "????????",
        "????????",
        "????????",
        "????????",
        "11223344"
    ]
}, {
    _timeTrialLevel: false,
    _enduranceLevel: true,
    _objectiveLevel: false,
    targetScore: 3000,
    _combatLevel: false,
    _planet: 'charybdo',
    _prevLocation: 'test0',
    _location: 'test1',
    _difficulty: undefined,
    tiles: [
        "????????",
        "????b???",
        "?o??h???",
        "????????",
        "?b??????",
        "?m??????",
        "????i??b",
        "???????b"
    ]
});