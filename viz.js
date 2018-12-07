function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

var svgWidth = document.getElementById("graph").getBoundingClientRect().width;

var margin = {top: 20, right: 100, bottom: 30, left: 100},
    width = svgWidth - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;



function createDataset() {
  var values = d3.range(16).map(d3.random.normal(10, 5));
  for (var i = 0; i < values.length; i++) {
    dataset[i].y = values[i];
  }
}

var testJSON = testData.filter((d) => (d.direction == 0)).filter((d) => (d.halfhour == "24:30:00"));

var dataset = [];
var dataset2 = [];
var dataset3 = [];
var dataset4 = [];

for (var i=0; i < testJSON.length; i++) {
  dataset[i] = {};
  dataset[i].x = i;
  dataset[i].y = testJSON[i].paxhourstotal;
  if (isFloat(testJSON[i].paxhoursuncomfortable) || isInt(testJSON[i].paxhoursuncomfortable)) {
    dataset[i].z = testJSON[i].paxhoursuncomfortable;
  } else {
    dataset[i].z = 0;
  }
}

for (var i=0; i < dataset.length; i++) {
  dataset2[i] = {};
  dataset2[i].x = i;
  dataset2[i].y = testJSON[i].paxhourstotal + 0.25;
  dataset3[i] = {};
  dataset3[i].x = i;
  dataset3[i].y = testJSON[i].paxhourstotal + 0.5;
  dataset4[i] = {};
  dataset4[i].x = i;
  dataset4[i].y = testJSON[i].paxhourstotal + 0.75;
}

/*
var dataset = [
  {x: 0, y: 80},
  {x: 1, y: 10},
  {x: 2, y: 13},
  {x: 3, y: 12},
  {x: 4, y: 16},
  {x: 5, y: 21},
  {x: 6, y: 18},
  {x: 7, y: 23},
  {x: 8, y: 0},
  {x: 9, y: 28},
  {x: 10, y: 35},
  {x: 11, y: 30},
  {x: 12, y: 32},
  {x: 13, y: 36},
  {x: 14, y: 40},
  {x: 15, y: 38},
];

*/

// Set the ranges
var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([height, 0]);
var z = d3.scale.linear().range(["purple", "orange"]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); })
    .interpolate("linear");

// Adds the svg canvas
var svg = d3.select("#graph")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data

    // Scale the range of the data

    x.domain(d3.extent(dataset, function(d) { return d.x; }));
    y.domain([0, d3.max(dataset, function(d) { return d.y; })]);
    z.domain([0, d3.max(dataset, function(d) { return d.z; })]);


    // Add the valueline path.
    svg.append("path")
        .data([dataset])
        .attr("class", "line")
        .attr("d", valueline(dataset));

        svg.append("path")
            .data([dataset2])
            .attr("class", "line2")
            .attr("d", valueline(dataset2));
            svg.append("path")
                .data([dataset3])
                .attr("class", "line3")
                .attr("d", valueline(dataset3));
                svg.append("path")
                    .data([dataset4])
                    .attr("class", "line4")
                    .attr("d", valueline(dataset4));

    svg.selectAll(".line")
      .data([dataset])
      .style("stroke", function(d) { return z(d.z); });

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);



// ** Update data section (Called from the onclick)
function updateData() {

  var values = d3.range(dataset.length).map(d3.random.normal(10, 1));
  for (var i = 0; i < values.length; i++) {
    dataset[i].y = values[i];
    dataset2[i].y = values[i] + 0.25;
    dataset3[i].y = values[i] + 0.5;
    dataset4[i].y = values[i] + 0.75;
  }

    	// Scale the range of the data again
    	x.domain(d3.extent(dataset, function(d) { return d.x; }));
	    y.domain([0, d3.max(dataset4, function(d) { return d.y; })]);

    // Select the section we want to apply our changes to
    var svg = d3.select("body").transition();

    // Make the changes
        svg.select(".line")   // change the line
            .duration(2000)
            .attr("d", valueline(dataset));
            svg.select(".line2")   // change the line
                .duration(2000)
                .attr("d", valueline(dataset2));
                svg.select(".line3")   // change the line
                    .duration(2000)
                    .attr("d", valueline(dataset3));
                    svg.select(".line4")   // change the line
                        .duration(2000)
                        .attr("d", valueline(dataset4));
        svg.select(".x.axis") // change the x axis
            .duration(2000)
            .call(xAxis);
        svg.select(".y.axis") // change the y axis
            .duration(2000)
            .call(yAxis);


}


setInterval(function() {
  updateData();
}, 2000);
