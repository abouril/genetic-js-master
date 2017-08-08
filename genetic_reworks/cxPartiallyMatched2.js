function include(arr,obj) {
    return (arr.indexOf(obj) != -1);
}
function sortNumber(a,b) {
    return a - b;
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function cxPartialyMatched(ind1, ind2) {
    var size = Math.min((ind1.length), (ind2.length))
    var random_sample = []
    random_sample.push(getRandomInt(0, size-1))
    random_sample.push(getRandomInt(0, size-1))
    var cx_points = random_sample.sort(sortNumber)
    var cxpoint1 = cx_points[0]
    var cxpoint2 = cx_points[1]
    console.log(cxpoint1)
    console.log(cxpoint2)
    var temp1 = ind1.slice(cxpoint1,cxpoint2 + 1).concat(ind2)
    var temp2 = ind1.slice(cxpoint1,cxpoint2 + 1).concat(ind1)
    var ind1 = []
    temp1.forEach(function(x){
        if(!(include(ind1, x))){
            ind1.push(x)
        }
    })
    var ind2 = []
    temp2.forEach(function(x){
        if(!(include(ind2,x))){
            ind2.push(x)
        }
    })
    return [ind1, ind2]
}

x = [7, 6, 1,2,3,4,5,8,9,10]
y = [4,3,10,9,8,6,7,2,1,5]
console.log(cxPartialyMatched(x,y))

//