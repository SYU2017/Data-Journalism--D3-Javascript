// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};
// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;
var padding = 25;  // Padding around canvas, i.e. replaces the 0 of scale
var formatPercent = d3.format('.2%');
// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("body")
  .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)
  // Append a group to the SVG area and shift ('translate') it to the right and to the bottom
  .append("g")
    .attr("transform", "translate(" + chartMargin.right + ", " + chartMargin.top + ")");

// Configure a band scale, with a range between 0 and the chartWidth and a padding of 0.1 (10%)
var x = d3.scaleLinear().range([0, chartWidth]).padding(0.1);

// Create a linear scale, with a range between the chartHeight and 0.
var y= d3.scaleLinear().range([chartHeight, 0]);

var valueline = d3.line()
    .x(function(d) { return x(d.poverty); })
    .y(function(d) { return y(d.healthcare); });

// Load data from hours-of-tv-watched.csv
d3.csv("Data1.csv", function(error, phData) {

  phData.forEach(function(d) {

    d.poverty = +d.poverty;
    d.healthcare = +d.healthcare;

  
  });
  // Scale the range of the data
  
  xScale = x
      .domain([
        d3.min([0,d3.min(d,function (d) { return d.poverty })]),
        d3.max([0,d3.max(d,function (d) { return d.poverty  })])
        ])
       .range([0,chartWidth]);
  
  yScale = y
      .domain([
       d3.min([0,d3.min(d,function (d) { return d.healthcare })]),
       d3.max([0,d3.max(d,function (d) { return d.healthcare })])
       ])
      .range([chartHeight,0]);

  svg.append("path")
      .data([phData])
      .attr("class", "line")
      .attr("d", valueline);
      
  // Add the scatterplot

  // Circles
  circles = svg.selectAll('circle')
      .data(d)
      .enter().append('circle')
        .attr('cx',function (d) { return x(d.poverty ); })
        .attr('cy',function (d) { return y(d.healthcare); })
        .attr('r','10')
        .attr('stroke','black')
        .attr('stroke-width',1)
        .attr('fill', 'blue')       
      .append('title') // Tooltip
        .text(function (d) { return d.variable +
                           '\nReturn: ' + formatPercent(d.poverty ) +
                           '\nStd. Dev.: ' + formatPercent(d.healthcare) });

    // Add Text Labels
  svg.selectAll("text")
                .data(d)
                .enter()
                .append("text")
                .text(function(d) {
                    return d[1]
                })
                .attr("x", function(d) {
                    return xScale(d[3])  // Returns scaled location of x
                })
                .attr("y", function(d) {
                    return yScale(d[4])  // Returns scaled circle y
                })
                .attr("font_family", "sans-serif")  // Font type
                .attr("font-size", "11px")  // Font size
                .attr("fill", "white");  // Font color       svg.selectAll("text")
                
                
    // X-axis
  xAxis = d3.svg.axis()
      .scale(xScale)
      .tickFormat(formatPercent)
      .ticks(8)
      .orient('bottom');

  svg.append("g")     // Append a group element (itself invisible, but helps 'group' elements)
                .attr("class", "axis")  // Assign the 'axis' CSS
                .attr("transform", "translate(0," + (chartHeight - padding) + ")")  // Place axis at bottom
                .call(xAxis);
                

  svg.append("text")
      .attr("transform", "translate(" + (chartWidth / 2) + " ," + (chartHeight - margin.bottom) + ")")
      .style("text-anchor", "middle")
      .text('In Poverty (%) ');

  // Y-axis
  yAxis = d3.svg.axis()
      .scale(yScale)
      .tickFormat(formatPercent)
      .ticks(8)
      .orient('left');// Define X axis and attach to graph
            
  svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + padding + ",0)")
                .call(yAxis);       
                

  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - chartMargin.left)
      .attr("x", 0 - (chartHeight/ 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text('Lacks healthcare (%)');

});
