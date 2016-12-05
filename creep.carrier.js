var moveLogic = require('logic.move');

var carrierLogic = {
    resourceList: {},
    init: function ()
    {
        for(var room in Game.rooms)
        {
            carrierLogic.resourceList[room] = updateResTargets(Game.rooms[room]);
        }

    },
    run: function (creep) {
        moveLogic.run(creep, this);
    },
    idle: function (creep) {
        creep.memory.target = null;
        if (needNewTarget(creep))
        {
            if (!carrierLogic.resourceList[creep.room.name] || carrierLogic.resourceList[creep.room.name].length == 0)
                return;

            var target = creep.pos.findClosestByRange(carrierLogic.resourceList[creep.room.name]);
            if (target)
            {
                creep.memory.target = target.id;
                moveLogic.transferState(creep, this, moveLogic.states.movingTo);
            }
        }
        else
        {
            var target = moveLogic.getHomeSpawn(creep);
            if (target)
            {
                creep.memory.target = target.id;
                moveLogic.transferState(creep, this, moveLogic.states.movingFrom);
            }
        }
    },
    workTo: function (creep, workSource) {
        if (workSource.energy == 0) {
            moveLogic.transferState(creep, this, moveLogic.states.idle);
            return;
        }
        creep.pickup(workSource);
        if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.target = moveLogic.getHomeSpawn(creep);
            moveLogic.transferState(creep, this, moveLogic.states.movingFrom);
        }

    },
    workFrom: function (creep, workSource) {
        if (creep.carry.energy > 0)
        {
            creep.transfer(workSource, RESOURCE_ENERGY);
        }
        else
            moveLogic.transferState(creep, this, moveLogic.states.idle);
    },
    sleep: function (creep) {

    }



    /*
     var targets = creep.room.find(FIND_STRUCTURES, {
     filter: (structure) => {
     return (//structure.structureType == STRUCTURE_EXTENSION ||
     //structure.structureType == STRUCTURE_SPAWN ||
     structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
     }
     });
     if(targets.length > 0) {
     if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
     creep.moveTo(targets[0]);
     }
     }*/
};
module.exports = carrierLogic;

function  removeFromCollectorTargets(targetId) {
    var index = Memory.collectorTargets.indexOf(targetId);
    if (index > -1) {
        Memory.collectorTargets.splice(index, 1);
    }
}

function needNewTarget(creep)
{
    return (creep.carry.energy / creep.carryCapacity < 0.75);
}

//Game.spawns.home.
function updateResTargets (room)
{
    var collectorTargets = [];
    var carries = room.find(FIND_MY_CREEPS, {
        filter: function(object) {
            if (object.memory.role == "carrier") {
                if (!object.memory.target)
                    return true;

                collectorTargets.push(object.memory.target);
            }
            return false;
        }
    });

    var droppedEnergy = [];
    var droppedEnergyItems = room.find(FIND_DROPPED_ENERGY).length;
    for (var i = 0; i < droppedEnergyItems; i++) {
        var largest = 0;
        var largestId = null;
        var largestObj = null;
        var energyTargets = room.find(FIND_DROPPED_ENERGY, {
            filter: function(object) {
                if (collectorTargets.indexOf(object.id) == -1 && droppedEnergy.indexOf(object.id) == -1) {
                    if (object.energy > largest) {
                        largest = object.energy;
                        largestId = object.id;
                        largestObj = object;
                    }
                }
            }
        });
        if (!largestObj)
            continue;

        if (carries.length > 0)
        {
            var closest = largestObj.pos.findClosestByRange(carries);
            if (closest)
            {
                closest.memory.target = largestObj.id;
                closest.memory.state = moveLogic.states.movingTo;
                continue;
            }
        }
        droppedEnergy[droppedEnergy.length] = largestObj;
    }
    return droppedEnergy;
}

