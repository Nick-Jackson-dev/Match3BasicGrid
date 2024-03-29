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
        "????????"
    ]
}, {
    _timeTrialLevel: false,
    _enduranceLevel: true,
    _objectiveLevel: false,
    _combatLevel: false,
    targetScore: 2500,
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
        "????????"
    ]
}, {
    _timeTrialLevel: false,
    _enduranceLevel: false,
    _objectiveLevel: true,
    _combatLevel: false,
    targetScore: 3200,
    _planet: 'mars',
    _prevLocation: 'test1',
    _location: 'test2',
    _difficulty: undefined,
    tiles: [
        "????????",
        "h???i???",
        "????i???",
        "????????",
        "????o???",
        "????o???",
        "????????",
        "bb??????"
    ]
}, {
    _timeTrialLevel: false,
    _enduranceLevel: false,
    _objectiveLevel: true,
    _combatLevel: false,
    targetScore: 3200,
    _planet: 'mars',
    _prevLocation: 'test1',
    _location: 'test2',
    _difficulty: undefined,
    tiles: [
        "????????",
        "????????",
        "???b????",
        "???b????",
        "iii?????",
        "imi?????",
        "iii?????",
        "?????oo?"
    ]
}, {
    _timeTrialLevel: false,
    _enduranceLevel: false,
    _objectiveLevel: true,
    _combatLevel: false,
    targetScore: 3300,
    _planet: 'mars',
    _prevLocation: 'test1',
    _location: 'test2',
    _difficulty: undefined,
    tiles: [
        "????????",
        "????????",
        "????????",
        "???m????",
        "???m????",
        "o??????o",
        "ooiiiioo",
        "oooiiooo"
    ]
});