function patents_graph( _id ) {

  var $ = jQuery.noConflict();

  var that = this;

  var id = _id;


  var margin = {top: 30, right: 20, bottom: 50, left: 50},
      widthCont = 1140,
      heightCont = 500,
      width, height;

  var svg,
      x, y,
      xAxis, yAxis,
      line;

      var parseDate = d3.time.format("%Y").parse;

  // Public Methods

  that.init = function() {

    console.log('patents');

    width = widthCont - margin.left - margin.right;
    height = heightCont - margin.top - margin.bottom;

    x = d3.scale.ordinal()
      .rangeRoundBands([0, width], 0.1);

    y = d3.scale.linear()
      .range([height, 0]);

    xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    line = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.patents); });

    svg = d3.select(id).append("svg")
      .attr("width", widthCont)
      .attr("height", heightCont)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    console.log('set size', widthCont, heightCont);

    // Load CSV
    d3.csv( $('body').data('url')+'/dist/csv/patents.csv', function(error, data) {

      data.forEach(function(d) {
       // d.date = parseDate(d.date);
        d.patents = +d.patents;
      });   

      console.log(error, data);   

      //x.domain(d3.extent(data, function(d) { return d.date; }));
     // y.domain([0, d3.max(data, function(d) { return d.patents; })]);

      x.domain(data.map(function(d) { return d.date; }));
      y.domain([0, d3.max(data, function(d) { return d.patents; })]);


      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      svg.append("g")
        .attr("class", "y axis")
          .call(yAxis);

      /*
      svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
      */

      svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.date); })
        .attr("y", height )
        .attr("height", 0)
        .attr("width", x.rangeBand());

       svg.selectAll(".bar")
        .transition().duration(1000).delay( function(d,i){ return 100*i; })
        .attr("y", function(d) { return y(d.patents); })
        .attr("height", function(d) { return height - y(d.patents); });
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
