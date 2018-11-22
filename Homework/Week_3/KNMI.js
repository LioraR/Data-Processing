// naam: Liora Rosenberg
// Student number: 11036435
// this file creates a website that draws a graph of the minimum and maximum temperature

// global variables that define the size of graph
var GRAPH_TOP = 0;
var GRAPH_BOTTOM = 480;
var GRAPH_LEFT = 50;
var GRAPH_RIGHT = 600;

// transform data to coordinates of canvas-element
function createTransform(domain, range) {
    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
   	var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max

    // returns the function for the linear transformation (y= a * x + b)
    return function(x) {
        return alpha * x + beta;
    }
}

// distracted month and year of data
function year(datums) {
    listYear = []
    listMaand = []
    for (var i = 0; i < datums.length; i++) {
        var date = datums[i]
        var maand = date.substring(4, 6)
        listMaand.push(maand)
        var year = date.substring(0, 4)
        listYear.push(year)
    }
    return [listMaand, listYear]
}

// draw graph
function graph(data, datums, listMaand, listYear) {
    var canvas = document.getElementById("Canvas");
    var ctx = canvas.getContext("2d");

    // temperature will not reach -9.9 C
    var tempMaand = "-99";

    // create data and lines on x-as
    for (var x = 0, j = 0; x < 12 && j < 366; x++, j++) {
        if (listMaand[j] != tempMaand) {
            tempMaand = listMaand[j];
            ctx.moveTo(GRAPH_LEFT + GRAPH_RIGHT / 12 * x, GRAPH_TOP)
            ctx.lineTo(GRAPH_LEFT + GRAPH_RIGHT / 12 * x, GRAPH_BOTTOM)
            ctx.fillText((listMaand[j] + "-" + listYear[j]),
                (GRAPH_LEFT + GRAPH_RIGHT / 12 * x), GRAPH_BOTTOM)
            ctx.strokeStyle = "#BBB";
            ctx.stroke();
        } else {
            x--;
        }
    }

    // reset line color
    ctx.strokeStyle = "#000"

    minTempList = [];
    maxTempList = [];
    yearList = [];

    // distract min and max temperature from data
    datums.forEach(function(test) {
        minTempList.push(data[test]["   minTemp"])
        maxTempList.push(data[test]["   maxTemp"])

    });

    // take minimum and maximum temperature
    var min = Math.min.apply(null, minTempList)
    var max = Math.max.apply(null, maxTempList)
    var range = max - min;

    // create data and lines on y-as
    for (var x = 0; x < 10; x++) {
        ctx.moveTo(GRAPH_LEFT, GRAPH_TOP + x * (GRAPH_BOTTOM - GRAPH_TOP) / 10)
        ctx.lineTo(GRAPH_RIGHT, GRAPH_TOP + x * (GRAPH_BOTTOM - GRAPH_TOP) / 10)
        ctx.fillText(Math.round(max - x * range / 10),
            (GRAPH_LEFT - 15), GRAPH_TOP + x * (GRAPH_BOTTOM - GRAPH_TOP) / 10)
        ctx.strokeStyle = "#BBB";
        ctx.stroke();
    }

    // reset line color
    ctx.strokeStyle = "#000"

    domain = [min, max]
    range = [GRAPH_BOTTOM, GRAPH_TOP]
    yFunction = createTransform(domain, range)

    // there are 366 days in a year
    domain = [0, 366]
    range = [GRAPH_LEFT, GRAPH_RIGHT]
    xFunction = createTransform(domain, range)

    // make x and y-axis labels
    var canvas = document.getElementById("Canvas");
    var context = canvas.getContext("2d");
    context.font = "15px sans-serif";
    context.fillText('Date', (GRAPH_RIGHT - GRAPH_LEFT) / 2 + GRAPH_LEFT,
        GRAPH_BOTTOM + 30);
    context.rotate(-90 * Math.PI / 180);
    context.fillText('Temperature (Celsius)', -(GRAPH_BOTTOM - GRAPH_TOP) / 2 - 50,
        GRAPH_LEFT - 30);
    context.rotate(90 * Math.PI / 180);

    // draw graph
    context.beginPath();
    context.moveTo(GRAPH_LEFT, GRAPH_TOP);
    context.lineTo(GRAPH_LEFT, GRAPH_BOTTOM);
    context.moveTo(GRAPH_LEFT, GRAPH_BOTTOM);
    context.lineTo(GRAPH_RIGHT, GRAPH_BOTTOM);
    context.stroke();

    // draw line of minimum temperature
    context.beginPath();
    context.moveTo(GRAPH_LEFT, minTempList[0])
    for (var i = 0; i < minTempList.length; i++) {
        context.lineTo(xFunction(i), yFunction(minTempList[i]))
    }
    context.strokeStyle = "#0000FF";
    context.stroke();

    // draw line of maximum temperature
    context.beginPath();
    context.moveTo(GRAPH_LEFT, minTempList[0])
    for (var i = 0; i < minTempList.length; i++) {
        context.lineTo(xFunction(i), yFunction(maxTempList[i]))
    }
    context.strokeStyle = "#8B0000";
    context.stroke();

}

// load and spite jason file
var fileName = "KNMI.json";
var txtFile = new XMLHttpRequest();
txtFile.onreadystatechange = function() {
    if (txtFile.readyState === 4 && txtFile.status == 200) {

        var data = JSON.parse(txtFile.responseText);
        var datums = Object.keys(data);

        var maandYear = year(datums)
        var listMaand = maandYear[0]
        var listYear = maandYear[1]

        graph(data, datums, listMaand, listYear)
    }
}

txtFile.open("GET", fileName);
txtFile.send();
