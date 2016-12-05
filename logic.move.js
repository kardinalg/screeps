//var stateIdle = "idle"; //i
//var stateMovingTo = "moveTo"; //t
//var stateMovingFrom = "moveFrom"; //f
//var stateWaiting = "sleep"; //s
//var stateWork = "work"; //w

var moveLogic = {
    states : {
        idle: "idle",
        movingTo: "moveTo",
        movingFrom: "moveFrom",
        waiting: "sleep",
        work: "work"
    },
    getTargetWithFallback: function (creep, controller) {
        var targetId = creep.memory.target;
        /*if (targetId == null || targetId == "")
         {
         logic.transferState(creep, harvesterStateIdle);
         return;
         }*/
        var source = Game.getObjectById(targetId);
        if (!source)
        {
            moveLogic.transferState(creep, controller, moveLogic.states.idle);
            return null;
        }
        return source;
    },
    getHomeSpawn: function (creep) {
        return Game.spawns["home"];
    },
    run: function (creep, controller) {
        var state = creep.memory.state;
        moveLogic.doAction(creep, controller, state);
    },
    transferState: function (creep, controller, state) {
        creep.memory.state = state;
        moveLogic.doAction(creep, controller, state);
    },
    doAction: function (creep, controller, state) {
        if (Memory.alarmMode)
        {
            var closestEnemy = creep.pos.findNearest(FIND_HOSTILE_CREEPS);
            if (closestEnemy && closestEnemy.pos.inRangeTo(creep.pos, 4)) {
                creep.memory.target = getHomeSpawn(creep).id;
                moveLogic.transferState(creep, this, moveLogic.states.movingFrom);
                return;
            }
        }

        switch (state)
        {
            case "":
            case null:
            case undefined:
            case moveLogic.states.idle:
                controller.idle(creep);
                break;

            case moveLogic.states.movingFrom:
            case moveLogic.states.movingTo:
                var source = moveLogic.getTargetWithFallback(creep, controller);
                if (!source)
                    return;

                creep.moveTo(source, {reusePath: 5});
                if (creep.pos.isNearTo(source))
                {
                    moveLogic.transferState(creep, controller, moveLogic.states.work);
                }
                break;
            
            case moveLogic.states.waiting:
                controller.sleep(creep);
                break;
                        
            case moveLogic.states.work:
                var workSource = moveLogic.getTargetWithFallback(creep, controller);
                if (!workSource)
                    return;

                controller.work(creep, workSource);
                break;
        }

    }
};
module.exports = moveLogic;