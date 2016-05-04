var renderGrid = function(values, domId, options) {

  // Get from options or use a default
  var width = options.width ? options.width : 300;
  var height = options.height ? options.height : 300;
  var rows = options.rows ? options.rows : 25;
  var cols = options.cols ? options.cols : 25;
  var symbols = options.symbols ? options.symbols : d3.distinct(values);
  var colorScale = options.colorScale ? options.colorScale : d3.scale.category20b();
  var dispatch = options.dispatch ? options.dispatch : null;
  var showColor = options.showColor;
  var showText = options.showText;

  // Format the data into grid layout with x, y position
  var data = generateGridLayout(values, symbols, width, height, rows, cols);

  d3.select("#" + domId).select("svg").remove();
  var grid = d3.select("#" + domId).append("svg")
                .attr({
                  "width": width,
                  "height": height,
                  "class": "chart"
                });
  var row = grid.selectAll(".row")
                .data(data)
              .enter().append("svg:g")
                .attr("class", "row");

  var gridCells = row.selectAll(".cell")
              .data(function (d) { return d; })
              .enter().append("g")
                .attr("class", "cell")
                .attr("transform", function(d) {
                  return "translate(" + [d.x, d.y] + ")" });
  gridCells
    .append("rect")
    .attr("width", function(d) { return d.width; })
    .attr("height", function(d) { return d.height; });

  gridCells
    .append("text")
      .attr({
        "x": function(d) { return d.width / 2 },
        "y": function(d) { return d.height / 2 },
        "dy": "0.35em"
      })
      .style({
        'text-anchor': 'middle'
      })
      .text(function(d) { return d.value });

  var displayText = function(flag) {
    grid.selectAll(".cell")
      .select("text")
        .attr("display", function() {
          return flag ? null : "none";
        });
  }
  var displayRect = function(flag) {
    grid.selectAll(".cell")
      .select("rect")
        .style("fill", function(d) {
          return flag ? colorScale(d.symbolIndex) : "#FFF";
        });
  }
  var updateDisplay = function() {
    displayText(showText);
    displayRect(showColor);
  };
  updateDisplay();

  if (dispatch) {
    dispatch.on("select" + "." + domId, function(selectedData) {
      grid.selectAll(".cell")
        .style("opacity", function(d) {
          if (selectedData.value !== d.value) {
            return 0.2;
          }
          return 1.0;
        })
        if (!showColor) {
          gridCells
            .select("rect")
              .style("fill", function(d) {
                if (selectedData.value === d.value) {
                  return colorScale(d.symbolIndex);
                }
                return "#FFF";
              });
        }
    });
    dispatch.on("clearSelect" + "." + domId, function() {
      gridCells
        .style("opacity", 1.0);
      if (!showColor) {
        gridCells
          .select("rect")
            .style("fill", "#FFF")
      }
    });
    dispatch.on("showText" + "." + domId, function() {
      showColor = false;
      showText = true;
      updateDisplay();
    });
    dispatch.on("showColor" + "." + domId, function() {
      showText = false;
      showColor = true;
      updateDisplay();
    });
  };
}

var renderGridLegend = function(symbols, domId, options) {
  var width = options.width ? options.width : 300;
  var height = options.height ? options.height : 50;
  var rows = options.rows ? options.rows : 1;
  var cols = options.cols ? options.cols : symbols.length;
  var colorScale = options.colorScale ? options.colorScale : d3.scale.category20b();
  var dispatch = options.dispatch ? options.dispatch : null;
  var showColor = options.showColor;
  var showText = options.showText;

  var data = generateGridLayout(symbols, symbols, width, height, rows, cols);
  console.log(data);
  var grid = d3.select("#" + domId).append("svg")
                .attr({
                  "width": width,
                  "height": height,
                  "class": "legend"
                });
  var row = grid.selectAll(".row")
                .data(data)
              .enter().append("svg:g")
                .attr("class", "row");

  var gridCells = row.selectAll(".cell")
              .data(function (d) { return d; })
              .enter()
              .append("g")
                .attr("class", "cell")
                .attr("transform", function(d) {
                  return "translate(" + [d.x, d.y] + ")"
                });

  gridCells
    .append("rect")
    .attr("width", function(d) { return d.width; })
    .attr("height", function(d) { return d.height; })
    .style("fill", function(d) {
      return showColor ? colorScale(d.symbolIndex) : "#FFF";
    })
    .style("stroke", '#555');

  if (showText) {
    gridCells
      .append("text")
        .attr({
          "x": function(d) { return d.width / 2 },
          "y": function(d) { return d.height / 2 },
          "dy": "0.35em"
        })
        .style({
          'text-anchor': 'middle'
        })
        .text(function(d) {
          return d.value;
        });
  }

  gridCells
    .on('mouseover', function() {
      var d = d3.select(this).datum();
      dispatch.select(d);
      gridCells.style("opacity", 0.2);
      d3.select(this).style("opacity", 1.0);
    })
    .on('mouseout', function() {
      var d = d3.select(this).datum();
      dispatch.clearSelect(d);
      gridCells.style("opacity", 1.0);
    });

  if (dispatch) {
    dispatch.on("select" + "." + domId, function(selectedData) {
      gridCells
        .style("opacity", function(d) {
          if (selectedData.value !== d.value) {
            return 0.2;
          }
          return 1.0;
        })
        .style("stroke-width", function(d) {
          if (selectedData.value !== d.value) {
            return 0.5;
          }
          return 3;
        })
    });
    dispatch.on("clearSelect" + "." + domId, function() {
      grid.selectAll(".cell")
        .style("opacity", 1.0)
        .style("stroke-width", 1)
    });
  }

};


function generateGridLayout(values, symbols, gridWidth, gridHeight, rows, cols) {
    var data = new Array();
    var gridItemWidth = gridWidth / cols;
    var gridItemHeight = gridHeight / rows;
    var stepX = gridItemWidth;
    var stepY = gridItemHeight;
    var xpos = 0;
    var ypos = 0;
    var idx = 0;

    for (var index_a = 0; index_a < rows; index_a++)
    {
        data.push(new Array());
        for (var index_b = 0; index_b < cols; index_b++)
        {
            data[index_a].push({
                                value: values[idx],
                                width: gridItemWidth,
                                height: gridItemHeight,
                                x: xpos,
                                y: ypos,
                                valueIndex: idx,
                                symbolIndex: symbols.indexOf(values[idx])
                            });
            xpos += stepX;
            idx += 1;
        }
        xpos = 0;
        ypos += stepY;
    }
    return data;
}
var genrateColorScale = function() {
  var colorScaleOne = d3.scale.category20b();
  var colorScaleTwo = d3.scale.category20c();
  return function(idx) {
    return idx < 20 ? colorScaleTwo(idx) : colorScaleOne(idx);
  }
}
