/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.harvester');
 * mod.thing == 'a thing'; // true
 */
var carrierStateIdle = "idle"; //i
var carrierStateMovingTo = "moveTo"; //t
var carrierStateMovingFrom = "moveFrom"; //f
var carrierStateWaiting = "sleep"; //s
var carrierStateWork = "work"; //w

var logic = {
    run: function (creep) {
        var state = creep.memory.state;
        doAction(creep, state);
    },
    transferState: function (creep, state) {
        creep.memory.state = state;
        doAction(creep, state);
    },
    doAction: function (creep, state) {
        switch (state)
        {
            case "":
            case null:
            case harvesterStateIdle:
                
                break;
            
            case harvesterStateMovingTo:
                var targetId = creep.memory.target;
                /*if (targetId == null || targetId == "")
                {
                    logic.transferState(creep, harvesterStateIdle);    
                    return;
                }*/
                var source = Game.getObjectById(targetId));
                if (!source)
                {
                    logic.transferState(creep, harvesterStateIdle);    
                    return;
                }
                creep.moveTo(source, {reusePath: 5});
                if (isNearTo(source))
                {
                    logic.transferState(creep, harvesterStateWork);
                }
                break;
            
            case harvesterStateMovingFrom:
                
                break;
            
            case harvesterStateWaiting:
                return;
                break;
                        
            case harvesterStateWork:
                if(creep.carry.energy < creep.carryCapacity) {
                    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        logic.transferState(creep, harvesterStateIdle);
                    }
                }
                else
                { //creep is full, wait for transfer
                    if (Memory.freeCarry == 0)
                    {
                        creep.memory.target = "";
                        logic.transferState(creep, harvesterStateMovingFrom);
                    }
                    else
                    {
                        
                        logic.transferState(creep, harvesterStateWaiting);
                    }
                }
                break;
        }
        
    
        if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
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
            }
        }
        
    }
};
module.exports = logic;