var moveLogic = require('logic.move');

var carrierLogic = {
    resourceList: [],
    init: function ()
    {
        for(var room in Game.rooms)
        {
            resourceList[room] = updateResTargets(Game.rooms[room]);
        }

    },
    run: function (creep) {
        moveLogic.run(creep, this);
    },
    idle: function (creep) {
        creep.memory.target = null;
        if (needNewTarget(creep))
        {
            if (resourceList[creep.room.id].length == 0)
                return;

            var target = creep.pos.findClosestByRange(resourceList[creep.room.id]);
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
    work: function (creep, workSource) {

        if (workSource.energy > 0 && workSource instanceof StructureSpawn)
        {
            creep.transferEnergy(workSource);
            return;
        }
        if (workSource.energy == 0) {
//            removeFromCollectorTargets(creep.memory.target);
            moveLogic.transferState(creep, this, moveLogic.states.idle);
            return;
        }
        creep.pickup(workSource);
        if (creep.energy == creep.carryCapacity) {
//            creep.memory.target = workSource.id;
//            removeFromCollectorTargets(workSource.id);
            creep.memory.target = moveLogic.getHomeSpawn(creep);
            moveLogic.transferState(creep, this, moveLogic.states.movingFrom);
        }

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
    return (creep.energy / creep.energyCapacity < 0.75);
}

//Game.spawns.home.
function updateResTargets (room)
{
    var collectorTargets = [];
    //составление списка текущих целей крипов
    var carries = room.find(Game.MY_CREEPS, {
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
    //сортировка энергии "на земле"
    for (var i = 0; i < room.find(Game.DROPPED_ENERGY).length;i++) {
        var largest = 0;
        var largestId = null;
        var largestObj = null;
        var energyTargets = room.find(Game.DROPPED_ENERGY, {
            filter: function(object) {
                if (collectorTargets.indexOf(object.id) == -1 && droppedEnergy.indexOf(object.id) == -1) {
                    if (object.energy > largest) {
                        largest = object.energy;
                        largestId = object.id;
                    }
                }
            }
        });

        if (carries.length > 0)
        {
            var closest = largestObj.pos.findClosestByRange(carries);
            if (closest)
            {
                closest.memory.target = largestObj.id;

                continue;
            }
        }
        droppedEnergy[droppedEnergy.length] = largestObj;
    }
    return droppedEnergy;
}

