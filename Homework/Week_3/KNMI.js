function createTransform(domain, range){

    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
   	var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max

    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return alpha * x + beta;
    }
}

var fileName = "x.json";
var txtFile = new XMLHttpRequest();
txtFile.onreadystatechange = function() {
    if (txtFile.readyState === 4 && txtFile.status == 200) {
        console.log(JSON.parse(txtFile.responseText));

        data = JSON.parse(txtFile.responseText);

        datums = Object.keys(data);

        listYearMaand = []

        for (var i = 0; i < datums.length; i++){
          date = datums[i]
          yearMaand = parseInt(date.substring(0,7))
          listYearMaand.push(yearMaand)
          //maand = date.substring(5,7)
        }

        console.log(datums);

        // uit data moet ik min_temp and max_temp pakken
        // in de lijst zet ik de min en maximum lijsten
        minTempList = [];
        maxTempList = [];
        yearList = [];

        datums.forEach(function(test){
          console.log(test);
          console.log(data[test]["   Min_temp"]);
          minTempList.push(data[test]["   Min_temp"])

          console.log(data[test]["   Max_temp"]);
          maxTempList.push(data[test]["   Max_temp"])

        });

        // hierin werken om het domein en range aan te passen
        // de min van de minimum temp pakken en de max van de maximumtemp pakken
        min = Math.min.apply(null, minTempList)
        max = Math.max.apply(null, maxTempList)
        console.log(min, max);

        domain = [min, max]
        range = [480, 0]

        yFunction = createTransform(domain, range)

        // ik moet het aantal jaar om de x-as zetten
        //var minY = Math.min.apply(null, datums)
        //var maxY = Math.max.apply(null, datums)
        var minYM = Math.min.apply(null, listYearMaand)
        var maxYM = Math.max.apply(null, listYearMaand)

        domain = [minYM, maxYM]
        console.log(domain);
        range = [0, 480]
        xFunction = createTransform(domain, range)

        var canvas = document.getElementById( "Canvas" );
        var context = canvas.getContext( "2d" );
        context.fillText('Date', 250,500);

        // groter maken canvas
        // grafiek maken
        var GRAPH_TOP = 0;
        var GRAPH_BOTTOM = 480;
        var GRAPH_LEFT = 0;
        var GRAPH_RIGHT = 480;

        //context.clearRect( 0, 0, 500, 400 );

        context.beginPath();
        context.moveTo( GRAPH_LEFT, GRAPH_TOP );
        context.lineTo( GRAPH_LEFT, GRAPH_BOTTOM );
        context.moveTo( GRAPH_LEFT, GRAPH_BOTTOM );
        context.lineTo( GRAPH_BOTTOM, GRAPH_RIGHT );
        //context.closePath();
        context.stroke();

        //var x = 0;
        context.beginPath();
        context.moveTo(listYearMaand[0], minTempList[0])
        for (var i = 0; i < minTempList.length; i++){
          // x = x+10
          //x = yearList
          console.log(listYearMaand[i])
          console.log(minTempList[i])
          context.lineTo(i, yFunction(minTempList[i]))
        }
        context.strokeStyle = "#0000FF";
        context.stroke();

        context.beginPath();
        context.moveTo(listYearMaand[0], minTempList[0])
        for (var i = 0; i < minTempList.length; i++){
          // x = x+10
          //x = yearList
          console.log(listYearMaand[i])
          console.log(minTempList[i])
          context.lineTo(i, yFunction(maxTempList[i]))
        }
        context.strokeStyle = "#8B0000";
        context.stroke();

        // grijze tussenlijnen maken
        context.beginPath();
        context.moveTo( GRAPH_LEFT, ( GRAPH_BOTTOM ) / 2 );
        context.lineTo( GRAPH_RIGHT, ( GRAPH_BOTTOM ) / 2 );
        context.globalAlpha = 0.3
        context.strokeStyle = "#BBB";
        context.stroke();

        context.beginPath();
        context.moveTo( GRAPH_LEFT, ( GRAPH_BOTTOM ) / 4 );
        context.lineTo( GRAPH_RIGHT, ( GRAPH_BOTTOM ) / 4 );
        context.globalAlpha = 0.3
        context.strokeStyle = "#BBB";
        context.stroke();

        context.beginPath();
        context.moveTo( GRAPH_LEFT, ( GRAPH_BOTTOM ) / 1.3333 );
        context.lineTo( GRAPH_RIGHT, ( GRAPH_BOTTOM ) / 1.3333 );
        context.globalAlpha = 0.3
        context.strokeStyle = "#BBB";
        context.stroke();

        // context.fillText("X", (cWidth + cleftMargin) /2, cHeight);
        // context.fillText("Length (min)", -(cHeight +cTopMargin) / 2, CleftMargin)

        maand = date.substring(5,7)
        year = date.substring(0,4)
        yearM = 20171101

        var canvas = document.getElementById( "Canvas" );
        var ctx = canvas.getContext( "2d" );

        for (var x = 0; x < 10; x++)
        {
          console.log(x);
          ctx.moveTo(0 + 48 * x, 0)
          ctx.lineTo(0 + 48 * x, 480)
          ctx.fillText(maand + "-" + year, GRAPH_RIGHT / datums.length + GRAPH_LEFT, GRAPH_BOTTOM)
        }
        ctx.stroke();

        // context.beginPath();
    //     for (var i = 0; i < datums.length; i++){
    //       console.log(yearM)
    //       if (yearM > 20171200 && yearM <2018000){
    //         yearM = yearM +8900
    //       }
    //       if (parseInt(datums[i]) === yearM) {
    //         console.log(124124);
    //         yearM = yearM + 100
    //         context.moveTo(GRAPH_RIGHT + yearM, GRAPH_BOTTOM)
    //         context.lineTo(GRAPH_RIGHT + yearM, GRAPH_TOP)
    //         //context.front
    //         context.fillText(maand + "-" + year, GRAPH_RIGHT / datums.length + GRAPH_LEFT, GRAPH_BOTTOM)
    //
    //     }
    // }



  }
}

txtFile.open("GET", fileName);
txtFile.send();
