var inst = require("./my.json")
var ind2route2 = require("./ind2route2");
var ind =[]
for (var i = 1; i <= 100; i++) {
    ind.push(i);
}



/*function ind2route2(individual, instance) {
    var route = [];
    var vehicleCapacity = instance['vehicle_capacity'];
    var deportDueTime = instance['deport']['due_time'];
    var dumpTime = instance['dump_time'];
    var subRoute = [];
    var vehicleLoad = 0;
    var elapsedTime = 0;
    var lastCustomerID = 0;
    individual.forEach(function(customerID){
        var demand = instance['customer_'+ customerID.toString()]['demand']
        var updatedVehicleLoad = vehicleLoad + demand
        var serviceTime = instance['customer_'+customerID.toString()]['service_time']
        var returnTime = instance['distance_matrix'][customerID][0]
        var updatedElapsedTime = elapsedTime + instance['distance_matrix'][lastCustomerID][customerID] + serviceTime + returnTime
        if (updatedVehicleLoad <= vehicleCapacity && updatedElapsedTime <= deportDueTime){
            subRoute.push(customerID);
            vehicleLoad = updatedVehicleLoad;
            elapsedTime = updatedElapsedTime - returnTime;
        }
        else if(updatedVehicleLoad >= vehicleCapacity && updatedElapsedTime <= deportDueTime) {
            var lastToDump = instance['distance_matrix'][lastCustomerID][100]
            var dumpToCurrent = instance['distance_matrix'][100][customerID]
            updatedElapsedTime = elapsedTime + lastToDump + dumpTime + dumpToCurrent + serviceTime + returnTime
            if (updatedElapsedTime <= deportDueTime) {
                subRoute.push(customerID)
                vehicleLoad = updatedVehicleLoad
                elapsedTime = updatedElapsedTime - returnTime
            }
            else {
                route.push(subRoute)
                subRoute = [customerID]
                vehicleLoad = demand
                elapsedTime = instance['distance_matrix'][0][customerID] + serviceTime
            }
        }
        else {
            route.push(subRoute)
            subRoute = [customerID]
            vehicleLoad = demand
            elapsedTime = instance['distance_matrix'][0][customerID] + serviceTime
        }
        lastCustomerID = customerID
    })
    if(subRoute != []) {
        route.push(subRoute)
    }
    return route
}*/

//HARD CODED DUMP AS 100.  WE NEED TO FIX THIS
function evalVRPTW2(individual, instance, unitCost, initCost, waitCost, delayCost) {
	var totalCost = 0;
    var vehicleCapacity = instance.vehicle_capacity;
    var route = ind2route2(individual, instance);
    var totalCost = 0;
    for(var i=0; i < route.length; i++) {
    	var subRoute = route[i];
    	var subRouteTimeCost = 0
        var subRouteDistance = 0
        var elapsedTime = 0
        var lastCustomerID = 0
        var vehicleLoad = 0
        for(var j=0; j < subRoute.length; j++){
        	var customerID = subRoute[j];
        	const custIDString = 'customer_' + customerID;
        	var demand = instance[custIDString].demand
            var updatedVehicleLoad = vehicleLoad + demand
            if (updatedVehicleLoad > vehicleCapacity){
                //we have to go the dump before servicing the current customerID
                var dummy = 1
                var previousToDump = instance['distance_matrix'][lastCustomerID][100]
                var dumpToCurrent = instance['distance_matrix'][100][customerID]
                var distance = previousToDump + dumpToCurrent
                subRouteDistance = subRouteDistance + distance
                var arrivalTime = elapsedTime + distance + instance['dump_time']
                var timeCost = waitCost * Math.max(instance[custIDString]['ready_time'] - arrivalTime, 0) + delayCost * Math.max(arrivalTime - instance[custIDString]['due_time'], 0) //does max function exist?
                subRouteTimeCost = subRouteTimeCost + timeCost
                elapsedTime = arrivalTime + instance[custIDString]['service_time']
                lastCustomerID = customerID
                vehicleLoad = demand
            }else{
                //if we did not have to go to the dump before servicing the current customerID
                var dummy = 2
                var distance = instance['distance_matrix'][lastCustomerID][customerID]
                subRouteDistance = subRouteDistance + distance
                var arrivalTime = elapsedTime + distance
                var timeCost = waitCost * Math.max(instance[custIDString]['ready_time'] - arrivalTime, 0) + delayCost * Math.max(arrivalTime - instance[custIDString]['due_time'], 0)
                subRouteTimeCost = subRouteTimeCost + timeCost
                elapsedTime = arrivalTime + instance[custIDString]['service_time']
                lastCustomerID = customerID
                vehicleLoad = updatedVehicleLoad
        	}
        }
        //# Calculate transport cost
        subRouteDistance = subRouteDistance + instance['distance_matrix'][lastCustomerID][0]
        var subRouteTranCost = initCost + unitCost * subRouteDistance
        //# Obtain sub-route cost
        var subRouteCost = subRouteTimeCost + subRouteTranCost
        //# Update total cost
        totalCost = totalCost + subRouteCost
    }
            
    var fitness = 1.0 / totalCost
    return fitness
}


console.log(evalVRPTW2(ind, inst, 1, 2, 1, 1))