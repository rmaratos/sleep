var margin = {top: 20, right:20, bottom: 30, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var bisectDate = d3.bisector(function(d) { return d.start; }).left;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.start); })
    .y(function(d) { return y(d.quality); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dsv = d3.dsv(";", "text/plain");
var data;

dsv("static/sleepdata.csv")
    .row(function(d) {
    return (d.Start) ? {
        start: new Date(d.Start),
        end: new Date(d.End),
        quality: parseInt(d["Sleep quality"]),
        duration: d["Time in bed"],
        feeling: d["Wake up"]
    } : null;

})
    .get(function(error, rows) {
        data = rows.filter( function(d) { return d !== null; });
        //console.log(data);
        x.domain(d3.extent(data, function(d) { return d.start; }));
        y.domain(d3.extent(data, function(d) { return d.quality; }));

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
            .attr("d7", ".71em")
            .style("text-anchor", "end")
            .text("Quality");

        console.log(data);

        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);

        var focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("circle")
            .attr("r", 4.5);

        svg.append("rect")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);

        function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.date > d1.date - x0 ? d1 : d0;
            focus.attr('transform', "translate(" + x(d.start) + "," + y(d.quality) + ")");
            focus.select("text").text(d.quality);
        }


        var columns = Object.keys(rows[0]);

        var table = d3.select("body").append("table").attr("border", "1px solid black").attr("cellpadding","2").style("border-collapse", "collapse"),
            thead = table.append("thead"),
            tbody = table.append("tbody");

        thead.append("tr")
            .selectAll("th")
            .data(columns)
            .enter()
            .append("th")
                .text(function(column) { return column; });

        var rows = tbody.selectAll("tr")
            .data(data)
            .enter()
            .append("tr");

        var cells = rows.selectAll("td")
            .data(function(row) {
                return columns.map(function(column) {
                    return {column: column, value: row[column]};
                });
            })
            .enter()
            .append("td")
                .text(function(d) {return d.value; });
    });
