function processData(d) {
    for (var i = 0; i < d.length; i++) {
        d[i]['impOfPeople'] = parseFloat(d[i]['impOfPeople']);
        d[i]['impOfSuborganization'] = parseFloat(d[i]['impOfSuborganization']);
        d[i]['clusterSize'] = parseFloat(d[i]['clusterSize']);
    }
    return d;
}

document.addEventListener('DOMContentLoaded', function () {
    Promise.all([d3.csv('Resume-Data.csv')])
        .then(function (values) {
            resumeData = values[0];
            resumeData = processData(resumeData);
            console.log(resumeData);
            plotGraph("board");
        });
});

/*
function plotGraph(type) {
    console.log(type);
    if (type == 'board') {
        zoomBoard();
    }
    else if (type == 'technical') {
        zoomTechnical();
    }
}
*/

function plotGraph() {
    console.log("Welcome to Board");
    const margin = { top: 30, right: 30, bottom: 120, left: 60 },
        width = 750 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#plotSvg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    data = resumeData;

    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.name))
        .padding(0.2);
    svg.append("g")
        .classed("bar_x", true)
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-12,10)rotate(-90)")
        .style("text-anchor", "end");

    const y = d3.scaleLinear()
        .domain([0, 12])
        .range([height, 0]);
    svg.append("g")
        .classed("bar_y", true)
        .call(d3.axisLeft(y));

    svg.append("g")
        .classed("bar", true)
        .selectAll("path")
        .data(data)
        .join("rect")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.impOfPeople))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.impOfPeople))
        .attr("fill", "blue")

    svg.append("text")
        .classed("bar_text", true)
        .attr("x", (width / 2))
        .attr("y", (margin.top - 25))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Relationship between Sub-organizations");

}