var moveLogic = require('logic.move');
var harvester = require('creep.harvester');
var carrier = require('creep.carrier');
var spawner = require('logic.spawner');
var builder = require('creep.builder');
//var _ = require('lodash');



module.exports.loop = function () {
    spawner();
    harvester.init();
    carrier.init();

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester')
        {
            harvester.run(creep);
        }
        if(creep.memory.role == 'carrier') {
            carrier.run(creep);
        }
        if(creep.memory.role == 'builder') {
            builder.run(creep);
        }
    }

}