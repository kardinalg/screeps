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
        workTo: "workA", //
        workFrom: "workB"
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
        var spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
        return spawn;
//        return Game.spawns["home"];
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

                var result = creep.moveTo(source, {reusePath: 5});
                if (creep.pos.isNearTo(source))
                {
                    if (state == moveLogic.states.movingTo)
                        moveLogic.transferState(creep, controller, moveLogic.states.workTo);
                    else
                        moveLogic.transferState(creep, controller, moveLogic.states.workFrom);
                    return;
                }
                if (result == ERR_NO_PATH)
                    moveLogic.transferState(creep, controller, moveLogic.states.idle);
                break;
            
            case moveLogic.states.waiting:
                controller.sleep(creep);
                break;
                        
            case moveLogic.states.workTo:
            case moveLogic.states.workFrom:
                var workSource = moveLogic.getTargetWithFallback(creep, controller);
                if (!workSource)
                    return;

                if (state == moveLogic.states.workTo)
                    controller.workTo(creep, workSource);
                else
                    controller.workFrom(creep, workSource);
                break;
        }

    }
};
module.exports = moveLogic;