function patents_visualization( _id ) {

  var $ = jQuery.noConflict();

  var that = this;

  var id = _id;


  var margin = {top: 20, right: 20, bottom: 70, left: 50},
      widthCont = 1140,
      heightCont = 500,
      width, height;

  var svg,
      x, y,
      xAxis, yAxis,
      line;

      var parseDate = d3.time.format("%y").parse;

  // Public Methods

  that.init = function() {

    console.log('patents');

    x = d3.time.scale()
      .range([0, width]);

    y = d3.scale.linear()
      .range([height, 0]);

    xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    line = d3.svg.line()
      .x(function(d) { return x(d.Year); })
      .y(function(d) { return y(d.Patents); });

    svg = d3.select("body").append("svg")
      .attr("width", widthCont)
      .attr("height", heightCont)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Load CSV
    d3.csv( $('body').data('url')+'/wp-content/uploads/csv/patents.csv', function(error, data) {

      data.forEach(function(d) {
        d.Year = parseDate(d.Year);
        d.Patents = +d.Patents;
      });

      console.log(error, data);

      x.domain(d3.extent(data, function(d) { return d.Year; }));
      y.domain([0, d3.max(data, function(d) { return d.Patents; })]);

      svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

      svg.append("g")
        .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Price ($)");

      svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    });
  };
  

  that.width = function(value) {
    if (!arguments.length) {
      return widthCont;
    }
    widthCont = value;
    return that;
  };

  that.height = function(value) {
    if (!arguments.length) {
      return heightCont;
    }
    heightCont = value;
    return that;
  };

  return that;
}
