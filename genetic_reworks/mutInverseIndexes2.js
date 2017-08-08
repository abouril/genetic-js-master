/**
 * Created by alexbouril on 8/5/17.
 */

function sortNumber(a,b) {
    return a - b;
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function mutInverseIndexes(individual){
    var size = individual.length
    var random_sample = []
    random_sample.push(getRandomInt(0, size-1))
    random_sample.push(getRandomInt(0, size-1))
    var positions = random_sample.sort(sortNumber)
    var start = positions[0]
    var stop = positions[1]
    var inversed_portion = []
    for(var i = stop; i>=start; i--){
        inversed_portion.push(individual[i])
    }
    individual = (individual.slice(0,start).concat(inversed_portion)).concat(individual.slice(stop+1, size))
    return [individual]
}



x = [7, 6, 1,2,3,4,5,8,9,10]
y = [4,3,10,9,8,6,7,2,1,5]
console.log(mutInverseIndexes(x))

//