// naam: Liora Rosenberg
// Student number: 11036435
//  this file creates a website that shows a map in with all the life expectancies are depicted

// dimensions
var margin = { top: 50, right: 50, bottom: 50, left: 50 },
      width = screen.width - margin.left - margin.right,
      height = 650 - margin.top - margin.bottom;
var padding = 20;

window.onload = function() {

    // distract jasons
    var life = "life.json"
    var health = "health.json"

   // http://bl.ocks.org/micahstubbs/raw/8e15870eb432a21f0bc4d3d527b2d14f/a45e8709648cafbbf01c78c76dfa53e31087e713/world_countries.json
    var data = "countries.json"
    var requests = [d3.json(health), d3.json(data), d3.json(life)];

    Promise.all(requests).then(function(response) {
        var Health = response[0];
        var data = response[1];
        var life = response[2];
        console.log(life)

        var format = d3.format(",");

        // create tooltips
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {

                // only select countries were data exist
                if (Health[d.properties.name] !== undefined) {

                    income = Health[d.properties.name]["Household net adjusted disposable income"]
                    life_expectancy = Health[d.properties.name]["Life expectancy"]

                      return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>"+
                             "<strong>Income: </strong><span class='details'>" + income + "<br></span>" +
                             "<strong>Life expectancy: </strong><span class='details'>" + life_expectancy + "</span>";
                }
            })

        // the colors were picked at this website: http://colorbrewer2.org/#type=sequential&scheme=Blues&n=9
        var color = d3.scaleThreshold()
            .domain([10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
            .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)",
                    "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)",
                    "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)", "rgb(3,19,43)"]);

        var svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append('g')
            .attr('class', 'map');

        var projection = d3.geoMercator()
               .scale(width/10)
               .translate([width / 2, (height) / 1.5]);

        var path = d3.geoPath().projection(projection);

        svg.call(tip);
        makeMap(data, Health);

        function makeMap(data, Health) {
            var IndexbyCountry = {};

          svg.append("g")
              .attr("class", "countries")
              .selectAll("path")
            .data(data.features).enter().append("path")
                .attr("d", path)
                .style("fill", function(d) {
                  // if a country is not in the dataset make it white
                  if (Health[d.properties.name] !== undefined){
                      return (color(Health[d.properties.name]["Life expectancy"]));
                  }
                    return "#FFFFFF"
                })

                .style('stroke', 'white')
                .style('stroke-width', 1.5)
                .style("opacity", 0.8)
                .style("stroke","white")
                .style('stroke-width', 0.3)
                .on('mouseover', function(d) {
                    tip.show(d);

                    d3.select(this)
                        .style("opacity", 1)
                        .style("stroke", "white")
                        .style("stroke-width", 3);
                })
                .on('mouseout', function(d) {
                    tip.hide(d);

                    d3.select(this)
                      .style("opacity", 0.8)
                      .style("stroke", "white")
                      .style("stroke-width", 0.3);
               })
               .on('click', function(d) {
                    d3.select("#chart").selectAll("*").remove().exit()
                    console.log(d)
                    country = d.properties.name
                    console.log(country)
                    lineChart(country)
               })

              svg.append("path")
                  .datum(topojson.mesh(data.features, function(a, b) { return a.name !== b.name; }))
                  .attr("class", "names")
                  .attr("d", path);
        };

        // make legend
        legend = svg.selectAll("#map")
          .data([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]).enter()
          .append("g")
          .attr("class", ".legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", width - 35)
            .attr("y", 0)
            .attr("width", 32)
            .attr("height", 20)
            .style("fill", d => color(d))

        // add text to legend
        legend.append("text")
            .attr("x", width - 65)
            .attr("y", 20)
            .text(function(d) {
              return d;
            })

        // select the dict with life_expectancy and years
        grandList = []
        listY = []
        listLE = []

        for (i = 0; i < Object.keys(life).length; i++) {
            lifeAndTime = Object.values(life)[i]
            lifeE = Object.values(lifeAndTime)
            years = Object.keys(lifeAndTime)

            listY.push(years)
            listLE.push(lifeE)
            grandList.push(listY, listLE)
        }

        // create SVG element
        var svg_line = d3.select("body")
              .append("svg")
              .attr("id", "chart")
              .attr("width", width)
              .attr("height", height)
              .style('background', 'wit');


      function lineChart(country = "Afghanistan") {

            // scaling x and y-as
            var xScale = d3.scaleLinear()
                .domain([2000, 2016])
                .range([margin.right, width - margin.left - 120])

            var yScale = d3.scaleLinear()
                .domain([50, 90])
                .range([height - margin.bottom, margin.top])

            // make y-as
            var yAxis = d3.axisLeft(yScale);
            svg_line.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + [margin.top, 0] + ")")
                .call(yAxis)

            // make x-as
            var xAxis = d3.axisBottom(xScale);
            svg_line.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + [0, height - margin.top] + ")")
                .call(xAxis)

              // select life expectancy and year from dictonary
              testdata = []
              for (i = 2000; i < 2017; i++) {

                lifeAndTime = Object.values(life[country])[i - 2000];
                var obj = {};
                obj['year'] = i;
                obj['lifeexp'] = lifeAndTime;
                testdata.push(obj)

            }

            var dataset = testdata

            // use date from:  https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89
            // d3's line generator
            var line = d3.line()
                .x(function(d, i) { return xScale(d.year); })
                .y(function(d) { return yScale(d.lifeexp); })
                .curve(d3.curveMonotoneX)

            // append the path, bind the data, and call the line generator
            svg_line.append("path")
                .datum(dataset)
                .attr("class", "line")
                .attr("d", line);

            // Set tooltips
            var toolTip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function(d) {

                    // only select countries were data exist
                    if (Object.keys(life) !== undefined) {

                         return "<strong>year: </strong><span class='details'>"
                         + d["year"] + "<br></span>"+ "<strong>Life expectancy: </strong><span class='details'>" +
                         d["lifeexp"] +"</span>";
                    }
                })
      svg_line.call(toolTip);

      // appends a circle for each datapoint
          svg_line.selectAll(".dot")
          .data(dataset).enter().append("circle")
                .attr("class", "dot") // Assign a class for styling
                .attr("cx", function(d, i) { return xScale(d.year) })
                .attr("cy", function(d) { return yScale(d.lifeexp) })
                .attr("r", 5)
                .on("mouseover", function(d) {
                    toolTip.show(d);

                    d3.select(this)
                      .style("opacity", 1)
                      .style("stroke", "white")
                      .style("stroke-width", 3);

            })
                .on('mouseout', function(d) {
                    toolTip.hide(d);
                })

          }

    }).catch(function(e) {
        throw (e);
    });
};
