// naam: Liora Rosenberg
// Student number: 11036435
//  this file creates a website that shows a map in with all the life expectancies are depicted

// dimensions
var margin = { top: 50, right: 50, bottom: 50, left: 50 },
      width = screen.width - margin.left - margin.right,
      height = 650 - margin.top - margin.bottom;


              // make title
            //  d3.select("head").append("title").text("Voter Turnout")
window.onload = function() {

    // distract jasons
    var vote = "turnout.json"
    var data = "europe.json"
    var requests = [d3.json(vote), d3.json(data)];

    Promise.all(requests).then(function(response) {
        var vote = response[0];
        var data = response[1];
        console.log(vote)

        var format = d3.format(",");

        // create tooltips
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {

              var votes = vote[d.properties.NAME]["Voter Turnout"]
                // only select countries were data exist
                return "<strong>Country: </strong><span class='details'>" + d.properties.NAME + "<br></span>" +
                       "<strong>Voter Turnout: </strong><span class='details'>" + votes + "</span>";

            })

        // the colors were picked at this website: http://colorbrewer2.org/#type=sequential&scheme=Blues&n=9
        var color = d3.scaleThreshold()
            .domain([10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
            .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)",
                    "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)",
                    "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)", "rgb(3,19,43)"]);

        var svg = d3.select("#map").append("svg")
            .attr("width", width/2)
            .attr("height", height)
            .append('g')
            .attr('class', 'map');

        var projection = d3.geoMercator()
               .scale(width/3)
               .translate([width / 6, (height) *1.5]);

        var path = d3.geoPath().projection(projection);

        svg.call(tip);
        makeMap(data, vote);

        function makeMap(data, vote) {
            var IndexbyCountry = {};

            var europe = topojson.feature(data, data.objects.europe).features


          svg.append("g")
              .attr("class", "countries")
              .selectAll("path")
            .data(europe).enter().append("path")
                .attr("d", path)
                .style("fill", function(d) {
                  // if a country is not in the dataset make it white
                  if ((vote[d.properties.NAME] !== undefined)){
                    return (color(vote[d.properties.NAME]["Voter Turnout"]));
                }
                    return "#FF0000"
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
                    country = d.properties.name
                    lineChart(country)
               })

              svg.append("path")
                  .datum(topojson.mesh(europe, function(a, b) { return a.name !== b.name; }))
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
            .attr("x", width - 800)
            .attr("y", 0)
            .attr("width", 32)
            .attr("height", 20)
            .style("fill", d => color(d))

        // add text to legend
        legend.append("text")
            .attr("x", width - 760)
            .attr("y", 20)
            .text(function(d) {
              return d;
            })

    }).catch(function(e) {
        throw (e);
    });
};
