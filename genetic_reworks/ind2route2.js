/**
 * Created by alexbouril on 8/4/17.
 */

var inst = require("./my.json")
var ind =[]
for (var i = 1; i <= 100; i++) {
    ind.push(i);
}
//HARD CODED DUMP AS 100.  WE NEET TO FIX THIS
function ind2route2(individual, instance) {
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
}
//console.log(ind2route2(ind, inst))

module.exports = ind2route2;