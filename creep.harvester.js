
var moveLogic = require('logic.move');

var harvestLogic = {
    sourceCache: {},
    init: function ()
    {

    },
    run: function (creep) {
        moveLogic.run(creep, this);
    },
    idle: function (creep) {
        creep.memory.target = selectTarget(creep.room, false);
        if (!creep.memory.target)
            creep.memory.target = selectTarget(creep.room, true);

        if (creep.memory.target)
            moveLogic.transferState(creep, this, moveLogic.states.movingTo);
        /*var source = creep.pos.findClosestByRange(FIND_SOURCES);
        if (source)
        {
            creep.memory.target = source.id;
            //TODO: better select target
            moveLogic.transferState(creep, this, moveLogic.states.movingTo);
        }*/
    },
    workTo: function (creep, workSource) {
        if (creep.harvest(workSource) == ERR_NOT_IN_RANGE)
        {
            moveLogic.transferState(creep, this, moveLogic.states.idle);
        }
    },
    workFrom: function (creep, workSource) {},
    sleep: function (creep) {}

};
module.exports = harvestLogic;

function selectTarget(room, force)
{
    var usedTargets = {};
    room.find(FIND_MY_CREEPS, {
        filter: function(object) {
            if (object.memory.role == "harvester" && object.memory.target)
            {
                if (!usedTargets[object.memory.target])
                    usedTargets[object.memory.target] = 0;

                usedTargets[object.memory.target] ++;
            }
        }
    });

    var allSpawns = room.find(FIND_MY_SPAWNS);
    var nearSource = allSpawns[0].pos.findClosestByRange(FIND_SOURCES, {
        filter: function(object) {
            return (!usedTargets[object.id] || usedTargets[object.id] < 2) || force;
        }
    });
    if (nearSource.length > 0)
        return nearSource[0].id;
    else
        return null;
}