var width = 1000,
    height = 500;
var svg = d3.select("body").append("svg");
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
        console.log(data);
        var columns = Object.keys(rows[0]);
        
        var table = d3.select("body").append("table").attr("border", "1px solid black").style("border-collapse", "collapse"),
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
