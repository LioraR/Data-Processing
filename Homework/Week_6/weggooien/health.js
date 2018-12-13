// naam: Liora Rosenberg
// Student number: 11036435
//  this file draws a scatterplot in a website that is based of the amount of women in science and consumer confidence.

// dimensions chart
var width = screen.width - 30;
var height = 250;
var margin = 50;
var barheight = 0;

// distract jason
d3.json("health.json").then(function(data) {
  // dimensions chart
  barWidth = (width - 2 * margin) / Object.keys(data).length;

  });
