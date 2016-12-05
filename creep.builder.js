
var moveLogic = require('logic.move');

var builderLogic = {
    sourceCache: {},
    init: function ()
    {

    },
    run: function (creep) {
        moveLogic.run(creep, this);
    },
    idle: function (creep) {
        if (creep.memory.target) {
            var oldProject = Game.getObjectById(creep.memory.target);
            if (oldProject && Memory.structures[oldProject.id]) {
                Memory.structures[oldProject.id].builder = null;
            }
        }
        if (creep.energy == 0)
        {
            var spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
            creep.memory.target = (spawn) ? spawn.id : null;
            moveLogic.transferState(creep, this, moveLogic.states.movingFrom);
            return;
        }

        creep.memory.target = selectTarget(creep.room);

        if (creep.memory.target)
            moveLogic.transferState(creep, this, moveLogic.states.movingTo);

    },
    workTo: function (creep, workSource) {
        if (creep.energy == 0)
        {
            moveLogic.transferState(creep, this, moveLogic.states.idle);
            return;
        }

        //if workSource is a structure, repair it.
        if (workSource instanceof Structure && workSource.type != STRUCTURE_CONTROLLER) {
            creep.repair(workSource);
            if (workSource.hits > workSource.hitsMax *.8) {
                moveLogic.transferState(creep, this, moveLogic.states.idle);
            }
            return;
        }

        //if workSource is a room controller, upgrade it
        if (workSource.id == creep.room.controller.id) {
            creep.upgradeController(workSource);
            return;
        }

        //if workSource is a Construction site, build it
        if (workSource instanceof ConstructionSite) {
            creep.build(workSource);
            if (workSource.progress == workSource.progressTotal) {
                moveLogic.transferState(creep, this, moveLogic.states.idle);
            }
        }

    },
    workFrom: function (creep, workSource) {
        var result = creep.withdraw(workSource);
        if (result == ERR_NOT_OWNER || result == ERR_INVALID_TARGET || result == ERR_FULL || result == ERR_NOT_IN_RANGE || creep.energy === creep.energyCapacity)
            moveLogic.transferState(creep, this, moveLogic.states.idle);
    },
    sleep: function (creep) {}

};
module.exports = builderLogic;


function selectTarget(creep)
{

    var structures = creep.room.find(FIND_STRUCTURES, {
        filter: function(object) {
            //console.log(object.structureType);
            if (object.hits < object.hitsMax/2 && (object.my || object.structureType == STRUCTURE_ROAD)) {
                return true;
            }
            return false;
        }
    });
    if (structures.length > 0) {
        Memory.repairtime = true;
    }


    structures = creep.room.find(FIND_STRUCTURES, {
        filter: function(object) {
            if (object.structureType != STRUCTURE_ROAD) {
                return false;
            }
            if (object.hits < object.hitsMax*.8) {
                return true;
            }
            return false;
        }
    });

    if (structures.length == 0) {
        Memory.repairtime = false;
    }

    var repairs = null;
    if (Memory.repairtime) {
        repairs = creep.pos.findClosest(FIND_STRUCTURES, {
            filter: function(object) {
                if (object.hits >= object.hitsMax*.8 || object.hits > 10000) {
                    return false;
                }
                if (object.structureType != STRUCTURE_ROAD && object.structureType != STRUCTURE_RAMPART) {
                    return false;
                }
                if (Memory.structures[object.id] == null || Memory.structures[object.id].builder == null || Game.getObjectById(Memory.structures[object.id].builder) == null) {
                    return true;
                }
                return false;
            }
        });
        if (repairs != null) {
            Memory.structures[repairs.id] = {};
            Memory.structures[repairs.id].builder = creep.id;
            return repairs.id;
        }
    }


    var construction = creep.pos.findClosest(FIND_CONSTRUCTION_SITES, {
        filter: function(object) {
            return !(Memory.structures[object.id] && Memory.structures[object.id].builder);

        }
    });

    if (construction != null) {
        Memory.structures[construction.id] = {};
        Memory.structures[construction.id].builder = creep.id;
        return construction.id;
    } else {
        return creep.room.controller.id;
    }
}