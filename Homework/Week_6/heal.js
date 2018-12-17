// naam: Liora Rosenberg
// Student number: 11036435
//  this file

// dimensions
var margin = {top: 50, right: 50, bottom: 50, left: 50},
            width = screen.width - margin.left - margin.right,
            height = 650 - margin.top - margin.bottom;
var padding = 20;

window.onload = function() {

  var life = "life.json"
  var health = "health.json"
  var data = "world_countries.json"
  var requests = [d3.json(health), d3.json(data), d3.json(life)];

  Promise.all(requests).then(function(response) {
      var Health = response[0];
      var data = response[1];
      var life = response[2];
      console.log(data);
      console.log(Health);
      console.log(life)

      var format = d3.format(",");

      // Set tooltips
      var tip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function(d) {

                    // als landen niet undifined zijn
                    if (Health[d.properties.name] !== undefined){
//                      console.log(d.properties.name);

  //                    console.log(Health);

                      income = Health[d.properties.name]["Household net adjusted disposable income"]
                      life_expectancy = Health[d.properties.name]["Life expectancy"]


                      return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>"+ "<strong>Income: </strong><span class='details'>" + income +"<br></span>" + "<strong>Life expectancy: </strong><span class='details'>" + life_expectancy +"</span>";
                    }
                  })

      var color = d3.scaleThreshold()
          .domain([10,20,30,40,50,60,70,80,90,100])
          .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)","rgb(3,19,43)"]);

      var path = d3.geoPath();

      var svg = d3.select("#map").append("svg")
                  .attr("width", width)
                  .attr("height", height)
                  .append('g')
                  .attr('class', 'map');

      var projection = d3.geoMercator()
                         .scale(130)
                        .translate( [width / 2, (height) / 1.5]);

      var path = d3.geoPath().projection(projection);
      var t = d3.transition()
                .duration(750);

      var click;

      svg.call(tip);
      ready(data, Health);

      function ready(data, Health) {
        var IndexbyCountry = {};


        svg.append("g")
            .attr("class", "countries")
          .selectAll("path")
            .data(data.features)
          .enter().append("path")
            .attr("d", path)
            .style("fill", function(d) {
              console.log(d.properties.name)
              // als een land niet in de data voorkomt, maak het wit
              console.log(Health)
              if (Health[d.properties.name] !== undefined){
                  return (color(Health[d.properties.name]["Life expectancy"]));
              }
                  return "#FFFFFF"
            })

            .style('stroke', 'white')
            .style('stroke-width', 1.5)
            .style("opacity",0.8)
            // tooltips
              .style("stroke","white")
              .style('stroke-width', 0.3)
              .on('mouseover',function(d){
                tip.show(d);

                d3.select(this)
                  .style("opacity", 1)
                  .style("stroke","white")
                  .style("stroke-width",3);
              })
              .on('mouseout', function(d){
                tip.hide(d);

                d3.select(this)
                  .style("opacity", 0.8)
                  .style("stroke","white")
                  .style("stroke-width",0.3);
              })
              .on('click', function(d){
                console.log(d)
                country = d.properties.name
                console.log(country)
                lineChart(country)
              })

              console.log(life)
        svg.append("path")
            .datum(topojson.mesh(data.features, function(a, b) { return a.name !== b.name; }))
            .attr("class", "names")
            .attr("d", path);

        };

        // make legend
        legend = svg.selectAll("#map")
          .data([10,20,30,40,50,60,70,80,90,100])
          .enter()
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
              .text(function(d){
                return d;
              })

              //(life["Afghanistan"]) = (Object.values(life)[0])
              //landen = object.keys(life)
              console.log(Object.keys(life))

              // select the dict with life_expectancy and years
              grandList = []
              listY = []
              listLE = []
              for (i = 0; i < Object.keys(life).length; i++) {
                lifeAndTime = Object.values(life)[i]
                lifeE = Object.values(lifeAndTime)
                years = Object.keys(lifeAndTime)

                listY.push(years)
                // console.log(listY)
                listLE.push(lifeE)
                // console.log(listLE)
                grandList.push(listY, listLE)
              }
              console.log(listLE)






              function lineChart(country="Afghanistan"){
                // verwijder oude grafiek (inclusief assen)
                console.log(country);
                console.log(typeof(country))
                // create SVG element
                var svg_line = d3.select("body")
                        .append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .style('background', 'wit');


                // scaling
                // var min =
                // var max = Math.max.apply(null, Object.values(life))
                // var minLE = Math.min.apply(null, lifeexpectancy)
                // var maxLE = Math.max.apply(null, lifeexpectancy)

                var xScale = d3.scaleLinear()
                .domain([2000, 2017])
                .range([margin.right, width - margin.left - 120])

                var yScale = d3.scaleLinear()
                .domain([70, 80])
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


      console.log(life[country]);

      // testdata = []
      // for (i = 2000; i < 2017; i++) {
      //
      //   lifeAndTime = Object.values(life)[country][i];
      //   var obj = {};
      //   obj['year'] = i;
      //   obj['lifeexp'] = lifeAndTime;
      //   testdata.push(obj)

      // }
      // console.log(testdata);


    console.log(life[country])
      var dataset = life[country];

      // 7. d3's line generator
      var line = d3.line()
          .x(function(d, i) { return xScale(d.year); }) // set the x values for the line generator
          .y(function(d) { return yScale(d.lifeexp); }) // set the y values for the line generator
          .curve(d3.curveMonotoneX) // apply smoothing to the line



      // 9. Append the path, bind the data, and call the line generator
      svg_line.append("path")
          .datum(dataset) // 10. Binds data to the line
          .attr("class", "line") // Assign a class for styling
          .attr("d", line); // 11. Calls the line generator

      // // 12. Appends a circle for each datapoint
      // svg_line.selectAll(".dot")
      //     .data(dataset)
      //   .enter().append("circle") // Uses the enter().append() method
      //     .attr("class", "dot") // Assign a class for styling
      //     .attr("cx", function(d, i) { return xScale(i) })
      //     .attr("cy", function(d) { return yScale(d.y) })
      //     .attr("r", 5)
      //       .on("mouseover", function(a, b, c) {
      //   			console.log(a)
      //         this.attr('class', 'focus')
      // 		})
      //       .on("mouseout", function() {  })

                  }



    }).catch(function(e){
        throw(e);
  });
};
