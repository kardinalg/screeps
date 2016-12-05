
module.exports = function() {

    if (Memory.creepCounter === undefined) {
        Memory.creepCounter = {};
    }


    //order of units to build and maintain

    var creepArray = ["harvester", "carrier", "builder", "carrier", "builder", "carrier", "builder"];

    //creep recipes for different roles.
    var creep_template = {"harvester": [MOVE, WORK ,WORK, WORK, WORK, WORK],
        "carrier": [CARRY, CARRY, MOVE, CARRY, MOVE, CARRY],
        "builder": [MOVE, WORK, CARRY, CARRY, WORK, MOVE, WORK, WORK, CARRY],
        "guard": [ATTACK, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE],
        "tower": [MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK],
        "kiter": [RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE],
        "healer": [MOVE, HEAL, HEAL, MOVE, HEAL, HEAL, MOVE, HEAL, HEAL],
        "paladin": [MOVE, HEAL, MOVE, RANGED_ATTACK],
        "fighter": [ATTACK, MOVE, ATTACK, ATTACK, MOVE, ATTACK, MOVE],
        "supertower":  [MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, RANGED_ATTACK, RANGED_ATTACK],
        "colony": [MOVE, WORK, WORK, CARRY, CARRY, MOVE, MOVE, WORK, CARRY]
    };
    //var Game.spawns = [Game.spawns.Spawn1, Game.spawns.Spawn2];
    for (var spawn in Game.spawns) {
        var concatArray = [];
        for (var e in Game.spawns[spawn].room.find(FIND_SOURCES)) {
            concatArray = creepArray.concat(concatArray);
        }
        if (Game.spawns[spawn] == Game.spawns.Spawn1) {
            concatArray.push("colony");
        }
        var count = 0;
        if (Memory.creepCounter[Game.spawns[spawn].name] && Memory.creepCounter[Game.spawns[spawn].name] > 0) {
            Memory.creepCounter[Game.spawns[spawn].name]--;
        } else {
            for (var i in concatArray) {
                if (undefined === Game.creeps[Game.spawns[spawn].name + concatArray[i] + count]){ //if creep does not exist
                    var creepSpecification = creep_template[concatArray[i]];
                    var creep = Game.spawns[spawn].createCreep(creepSpecification, Game.spawns[spawn].name + concatArray[i] + count);
                    //if the creep cant be made because of lack of charged extensions, remove parts until it can be made.
                    while (creep == -6 && creepSpecification.length >3) {
                        creepSpecification.pop();
                        creep = Game.spawns[spawn].createCreep(creepSpecification, Game.spawns[spawn].name + concatArray[i] + count);
                    }
                    //creep was made successfully, assign a role to its memory.
                    if (creep !=-4 && creep != -6) {
                        Memory.creepCounter[Game.spawns[spawn].name] = 60;
                        Memory.creeps[creep].role = concatArray[i];
                    }
                    break;
                }
                count++;
            }
        }
    }
};