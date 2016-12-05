
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
        var sources = creep.room.findNearest(FIND_SOURCES);
        creep.memory.target = sources[0].id;
        //TODO: better select target
        moveLogic.transferState(creep, this, moveLogic.states.movingTo);
    },
    work: function (creep, workSource) {
        if (creep.harvest(workSource) == ERR_NOT_IN_RANGE)
        {
            moveLogic.transferState(creep, this, moveLogic.states.idle);
        }
    },
    sleep: function (creep) {}

};
module.exports = harvestLogic;

/*
if (!Memory.sourceArray) {
    var orderedSourceArray = [];
    for (var i = 0; i < Game.spawns.home.room.find(Game.SOURCES).length; i++) {
        var nearSource = Game.spawns.home.pos.findNearest(Game.SOURCES, {
            filter: function(object) {
                if (orderedSourceArray == []) {
                    return true;
                }
                var inArray = true;
                for (var j = 0;j<orderedSourceArray.length;j++) {
                    if (orderedSourceArray[j][0] == object.id) {
                        inArray = false;
                    }
                }
                return inArray;
            }
        });
        orderedSourceArray[orderedSourceArray.length] = [nearSource.id, null, null];
    }
    Memory.sourceArray = orderedSourceArray;
}

Game.spawns.home.room.find(Game.MY_CREEPS, {
    filter: function(object) {
        if (object.memory.role == "worker" && object.memory.target) {

        } else if (object.memory.role == "worker") {
            for (var foundSource in Memory.sourceArray) {
                if (Memory.sourceArray[foundSource][1] == null) {
                    Memory.sourceArray[foundSource][1] = object.id
                    object.memory.target = object.pos.findNearest(Game.SOURCES, {
                        filter: function(object2) {
                            return Memory.sourceArray[foundSource][0] == object2.id;
                        }
                    }).id;
                    return;
                }
            }
        }
        return false;
    }
});
*/