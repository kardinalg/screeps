var mainMoveLogic = require('logic.move');
var harvester = require('creep.harvester');
var carrier = require('creep.carrier');
//var _ = require('lodash');



module.exports.loop = function () {
    for(var name in Game.rooms.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester')
        {
            harvester.run(creep);
        }
        if(creep.memory.role == 'carrier') {
            carrier.run(creep);
        }
        // if(creep.memory.role == 'builder') {
            // roleBuilder.run(creep);
        // }
    }

}