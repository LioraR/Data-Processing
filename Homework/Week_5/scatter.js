// naam: Liora Rosenberg
// Student number: 11036435
//  this file draws a scatterplot in a website that is based of the amount of women in science and consumer confidence.

// dimensions chart
var width = screen.width - 30;
var height = 250;
var margin = 50;
var barheight = 0;


window.onload = function() {
  // distract jasons
  var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
  var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"
  var requests = [d3.json(consConf), d3.json(womenInScience)];

  Promise.all(requests).then(function(response) {
    main(response)

  }).catch(function(e){
      throw(e);
  });

};
function main(response){
  var consumerConf = transformResponse(response[0]);
  var womInScien = transformResponse(response[1]);

  countries = []
  allConsConf = []
  allWomen = []
  grandList = []

  // iterate over the data to extract year, country and consumer confidence
  consumerConf.forEach(function(datapoint) {
    var year = datapoint["time"]
    var country = datapoint["Country"]
    countries.push(country)

    var consConfP = datapoint["datapoint"]
    allConsConf.push([consConfP])
    grandList.push([consConfP, year, country]);

  });

  // iterate over the data to extract year, country and amount of women in science
  womInScien.forEach(function(datapoint) {
    var women = datapoint["datapoint"]
    var year = datapoint["time"]
    var country = datapoint['Country']
    allWomen.push([women])

    // make sure that years and country are the same for every datapoint
    grandList.forEach(function(point) {
      if (point[1] === year && point[2] === country) {
        point.unshift(women);
        return;
      }
    });

  });

  //data = {}
  // remove incomplete row in list
  grandList.forEach(function(point, i) {
    if (point.length !== 4) {
      grandList.splice(i, 1)
      //data[year[i]] = consConfP[count], women[count], country[count]
      //count++
    }
  });

  console.log(grandList);

  // scaling
  var max = Math.max.apply(null, allWomen)
  var minCC = Math.min.apply(null, allConsConf)
  var maxCC = Math.max.apply(null, allConsConf)

  var xScale = d3.scaleLinear()
  .domain([0, max])
  .range([margin, width - margin - 120])

  var yScale = d3.scaleLinear()
  .domain([minCC, maxCC])
  .range([height - margin, margin])

  // add color
  dict ={}
  color = ["#ffffb2", "#fed976", "#feb24c", "#fd8d3c", "#f03b20", "#bd0026"]
  count = 0
  countries.forEach(function(datapoint, i) {
    if (!(countries[i] in dict)){
      dict[countries[i]] = color[count]
      count++
    }
  })

  // create SVG element
  var svg = d3.select("body")
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .style('background', 'wit');

  svg.selectAll("circle")
     .data(grandList)
     .enter()
     .append("circle")
     .attr("cx", function(d) {
      return xScale(d[0]);
      })
      .attr("cy", function(d) {
      return yScale(d[1]);
      })
      .attr("r", 5)
      .attr("fill", function(d){
    return dict[d[3]];
  });

  // make y-as
  var yAxis = d3.axisLeft(yScale);
  svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(" + [margin, 0] + ")")
  .call(yAxis)

  // make x-as
  var xAxis = d3.axisBottom(xScale);
  svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(" + [0, height - margin] + ")")
  .call(xAxis)

  // add label percentage women researchers
  svg.append("text")
      .attr("transform", "translate(" + [width / 2, height - margin / 3] + ")")
      .text("percentage women researchers")

  // add label consumer confidence
  svg.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(" + [margin / 3, height / 3 * 2 - margin] + ") rotate(-90)")
      .text("consumer confidence")

  // make legend
  console.log(Object.values(dict))
  legend = svg.selectAll(".legend")
    .data(Object.keys(dict))
    .enter()
    .append("g")
    .attr("class", ".legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
      .attr("x", width - 145)
      .attr("y", 0)
      .attr("width", 32)
      .attr("height", 20)
      .style("fill", function(d, i) {
        return Object.values(dict)[i]
      })

      // add text to legend
      legend.append("text")
        .attr("x", width - 110)
        .attr("y", 20)
        .text(function(d){
          return d;
        })

      var dims = 10
      var a = 100;
      var b = dims.width + dims.margin + dims.margin;

      var years = Object.keys(data).maps(x => parseInt(x));

      var thisYear = d3.min(years);

      var slider = d3.sliderHorizontal()
                     .min(d3.min(years))
                     .max(d3.max(years))
                     .step(1)
                     .width(dims.width)
                     .tickValues(years)
                     .tickFormat(d3.format("d"))
                     .on("onchange", function(year){
                       thisYear - year;
                     });

}

// function that transforms jason in appropriated format
function transformResponse(data){

    // access data property of the response
    let dataHere = data.dataSets[0].series;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.series;
    let seriesLength = series.length;

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output array, an array of objects, each containing a single datapoint
    // and the descriptors for that datapoint
    let dataArray = [];

    // for each string that we created
    strings.forEach(function(string){
        // for each observation and its index
        observation.values.forEach(function(obs, index){
            let data = dataHere[string].observations[index];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                let tempString = string.split(":");
                tempString.forEach(function(s, indexi){
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                });

                // every datapoint has a time and ofcourse a datapoint
                tempObj["time"] = obs.name;
                tempObj["datapoint"] = data[0];
                dataArray.push(tempObj);
            }
        });
    });


    // return the finished product!
    return dataArray;
}
