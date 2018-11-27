// naam: Liora Rosenberg
// Student number: 11036435

// dimensions chart
var width = screen.width-50;
//-50;
var height = 250;
var margin = 50;
var barheight = 0;
var barWidth;
var domainY;
var dataToPixel;

var svg = d3.select("body").append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background', 'wit')

// toolTip
const tooltip = d3.select("body").append("div").attr("class", "toolTip")

// distract jason
d3.json("data.json").then(function(data) {

// dimensions chart
console.log(Object.keys(data).length);
barWidth = (width - 2 * margin) / Object.keys(data).length;
console.log((Object.keys(data)).map(Number))

// calculate maximum value for barheight
for (x in data) {
  if (data[x]['Value'] > barheight) {
    barheight = data[x]['Value'];
  }
}
domainY = Math.ceil(barheight / 10) * 10;
dataToPixel = (height - 2 * margin) / domainY;

var i = 0;
svg.selectAll(".bar")
.data((Object.keys(data)).map(Number))
.enter().append("rect")
.style('fill', function(d) {
  return "rgb(" + (d * 0.1) + ", 0, 0)";
})
.attr('y', height)
.attr('width', barWidth)
.attr('height', function(d){
 return dataToPixel * data[d]["Value"];
})
.attr('y', function(d){
 return height - margin - dataToPixel * data[d]["Value"];

})
.attr('x', function(){
return margin + barWidth * i++;
})
.on("mousemove", function(d){
  tooltip
  .style("left", d3.event.pageX - 50 + "px")
  .style("top", d3.event.pageY - 70 + "px")
  .style("display", "inline-block")
  .html(data[d]["Value"]);
})


// make value labels
d3.select("body").append('svg')
.selectAll("text")
   .data(data)
   .enter()
   .append("text")
   .text(function(d) {
     return d;
   })
   .attr('y', function(d){
     return height - 5 * data[d]["Value"];
   })
   .attr('x', function(i){
     return barWidth * i;
   })

console.log(parseInt(Object.keys(data).slice(-1)[0]))
// make xscale and yscale
var xScale =d3.scaleLinear()
        .domain([parseInt(Object.keys(data)[0]), parseInt(Object.keys(data).slice(-1)[0])])
        .range([margin, width-margin])

console.log(xScale)

var yScale = d3.scaleLinear()
        .domain([domainY, 0])
        .range([margin, height-margin])

console.log(yScale)

var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);

// make percentages
//var formatAsPercentage = d3.format(".0%");
//yAxis.tickFormat(formatAsPercentage);

// make y-as
svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate("+[margin, 0]+")")
  .call(yAxis)

// make x-as
svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate("+[0, height-margin]+")")
  .call(xAxis)

// add label year
svg.append("text")
  .attr("transform", "translate("+[width/2, height-margin/3]+")")
  .text("Years")

// add label percentage
svg.append("text")
  .attr("text-anchor", "middle")
  .attr("transform", "translate("+[margin/3, height/3*2-margin]+") rotate(-90)")
  .text("percentage")

// make tooltip

});
