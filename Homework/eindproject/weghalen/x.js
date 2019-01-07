// global constants margins and dimensions for datamap and barchart
var marginsMap = {
  "left": 100,
  "right": 100,
  "top": 0,
  "bottom": 0
};

var dimMap = {
  "width": 850 - marginsMap.right - marginsMap.left,
  "height": 550 - marginsMap.top - marginsMap.bottom
};

var euCountries = "https://gist.githubusercontent.com/milafrerichs/69035da4707ea51886eb/raw/4cb1783c2904f52cbb8a258ee96031f9054d155b/eu.topojson"


window.onload = function() {

  // create tooltips
  var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {

          // only select countries were data exist
          return "hoi"

      })

// set svg for datamap
var svg = d3.select("#area1")
  .append("svg")
  .attr("height", dimMap.height + marginsMap.top + marginsMap.bottom)
  .attr("width", dimMap.width)
  .attr("class", "svg")
  .attr("id", "map")
  .append("g")
  .attr("transform", "translate(" + marginsMap.left + "," + marginsMap.top + ")");
svg.call(tip);

var vote = "turnout.json"
var requests = [d3.json(euCountries), d3.json(vote)]

Promise.all(requests).then(function(response) {
  // gather data
  let topology = response[0];
  let data = response[1];

  let projection = d3.geoMercator()
  .translate([dimMap.width / 5, dimMap.height * 1.4])
  .scale(415)

  let path = d3.geoPath()
  .projection(projection)


  // make datamap and barChart
  ready(0, topology, data);


function ready(error, data, spending) {
  /*
    topjson.feature converts
    our RAW geo data into USEABLE geo data
    always pass it data, then data.objects.__something__
    then get .features out of it
  */

  var countries = topojson.feature(data, data.objects.europe).features
  console.log(countries)
  console.log(data.objects.europe)
  console.log(data)

  // add a path for each country
  svg.selectAll(".country")
    .data(countries)
    .enter().append("path")
    .attr("class", "country")
    .attr("d", path)
    // fill color country according the scaled threshold array for colors
    .attr("fill", function(d) {
        return "#FF0000";

    })
    // set mouseover effect with tooltip
    .on("mouseover", function(d) {
      d3.select(this).classed("selected", true);
      tip.show(d, spending);
    })
    .on("mouseout", function(d) {
      d3.select(this).classed("selected", false);
      tip.hide(d, spending);
    })
    // when country is clicked update function is called
    .on("click", function(d) {
      console.log(d.properties.iso_a3);
      return updateGraph(dimBar, d.properties.iso_a3, marginsBar)
    })

}

}).catch(function(e) {
    throw (e);
});
}
