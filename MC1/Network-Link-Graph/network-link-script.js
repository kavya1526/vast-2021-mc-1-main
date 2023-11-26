// Processing the data type to maintain uniformity
function processDataType(d) {
    for (var i = 0; i < d.length; i++) {
        d[i]['impOfPeople'] = parseFloat(d[i]['impOfPeople']);
        d[i]['impOfSuborganization'] = parseFloat(d[i]['impOfSuborganization']);
        d[i]['clusterSize'] = parseFloat(d[i]['clusterSize']);
    }
    return d;
}

// Grouping the nodes (people) in terms of their respective organization
function groupByOrganization(d) {
    const organizationClusters = [];
    d.forEach(element => {
        if(!organizationClusters[element.suborganization]) {
            organizationClusters[element.suborganization] = [];
        }
        organizationClusters[element.suborganization].push(element);
    });
    return organizationClusters;
}

// Loading the data
document.addEventListener('DOMContentLoaded', function () {
    Promise.all([d3.csv('Resume-Data.csv')])
        .then(function (values) {
            resumeData = values[0];
            resumeData = processDataType(resumeData);
            nodeGroups = groupByOrganization(resumeData);
            console.log(resumeData);
            console.log(nodeGroups);
            // plotGraph("board");
            plotClusters(resumeData, nodeGroups);
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

function plotClusters(resumeData, nodeGroups) {

    const margin = { top: 30, right: 30, bottom: 120, left: 60 },
        width = 750 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3.select("#plotSvg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select("#plotDiv")
        .append("div")
        .attr("class", "d3-tooltip")
        .style("position", "absolute")
        .style("opacity", "0")
        .style("padding", "5px")
        .style("color", "black")
        .style("background", "white")
        .style("border", "2px solid #000000")
        .style("stroke", "black")
        .style("stroke-width", "2px")
        .style("border-radius", "5px")

    // var stimulationTask = d3.forceSimulation(resumeData)
    //     .force("x", d3.forceX(Math.random()*width))
    //     .force("y", d3.forceY(Math.random()*height.strength(0.1)))
    //     .force("collide", d3.forceCollide())
    //     .stop();

    svg.selectAll("circle")
        .data(Object.keys(nodeGroups))
        .enter().append("g")
        .selectAll("circle")
        .data(d => nodeGroups[d])
        .enter().append("circle")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("cx", function(d) {
            if(d.suborganization == 'Board') {return 0.1 * width}
            if(d.suborganization == 'Technical') {return 0.3 * width}
            if(d.suborganization == 'Security') {return 0.5 * width}
            if(d.suborganization == 'Executive') {return 0.7 * width}
            if(d.suborganization == 'Operations') {return 0.9 * width}
        })
        .attr("cy", function(d) {
            if(d.suborganization == 'Board') {return 0.7 * height}
            if(d.suborganization == 'Technical') {return 0.3 * height}
            if(d.suborganization == 'Security') {return 0.9 * height}
            if(d.suborganization == 'Executive') {return 0.1 * height}
            if(d.suborganization == 'Operations') {return 0.5 * height}
        })
        .attr("fill", d => colorScale(d.suborganization))
        .attr("r", d => (d.impOfPeople / 9) * 30)
        .on("mouseover", function (event, d) {
            // Show tooltip on mouseover
            tooltip.html(`Name : ${(d.name)} <br>  Role : ${(d.role)} <br>  Suborganization : ${(d.suborganization)} ` )
                .style("opacity", 0.9)
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 15) + "px");
        })
        .on("mousemove", function (event) {
            // Move tooltip with the mouse
            tooltip.style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 15) + "px");
        })
        .on("mouseout", function (event) {
            // Hide tooltip on mouseout
            tooltip.html(``)
                .style("opacity", 0);
        });

        
}

// function plotGraph() {
//     console.log("Welcome to Board");

//     d3.selectAll(".circle").remove()
//     d3.selectAll(".text").remove();

//     const margin = { top: 30, right: 30, bottom: 120, left: 60 },
//         width = 750 - margin.left - margin.right,
//         height = 500 - margin.top - margin.bottom;

//     const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

//     /*
//     const strokeScale = d3.scaleLinear()
//         .domain([d3.min(resumeData, d => d.impOfSuborganization), d3.max(resumeData, d => d.impOfSuborganization)])
//         .range([1, 6]); // Adjust stroke width range based on impOfSuborganization
//     */

//     const svg = d3.select("#plotSvg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", `translate(${margin.left},${margin.top})`);

//     data = resumeData;

//     const tooltip = d3.select("#plotDiv")
//         .append("div")
//         .attr("class", "d3-tooltip")
//         .style("position", "absolute")
//         .style("opacity", "0")
//         .style("padding", "5px")
//         .style("color", "black")
//         .style("background", "white")
//         .style("border", "2px solid #000000")
//         .style("stroke", "black")
//         .style("stroke-width", "2px")
//         .style("border-radius", "5px")

//     const x = d3.scaleBand()
//         .range([0, width])
//         .domain(data.map(d => d.name))
//         .padding(0.2);
//     svg.append("g")
//         .classed("scatter_x", true)
//         .attr("transform", `translate(0, ${height})`)
//         .call(d3.axisBottom(x))
//         .selectAll("text")
//         .attr("transform", "translate(-12,10)rotate(-90)")
//         .style("text-anchor", "end");

//     const y = d3.scaleLinear()
//         .domain([0, d3.max(data, d => d.impOfPeople)]) // Adjusted y domain
//         .range([height, 0]);
//     svg.append("g")
//         .classed("scatter_y", true)
//         .call(d3.axisLeft(y));

//     svg.append("g")
//         .classed("scatter", true)
//         .selectAll("circle")
//         .data(data)
//         .join("circle")
//         .attr("cx", d => x(d.name) + x.bandwidth() / 2) // Adjusted x position for circles
//         .attr("cy", height/2) // Fixed y position at the bottom of the chart
//         .attr("r", d => d.impOfPeople * 3) // Adjusted radius based on impOfPeople
//         .attr("fill", d => colorScale(d.impOfPeople))
//         .attr("stroke", "black") // Border color 
//         .attr("stroke-width", "1") // Border width 
//         .attr("opacity", 1)
//         .classed("box_circles", true)
//         .on("mouseover", function (event, d) {
    
//             // Show tooltip on mouseover
//             tooltip.html(`Name : ${(d.name)} <br>  Importance of Person : ${(d.impOfPeople)} <br>  Importance of Suborganization : ${(d.impOfSuborganization)} ` )
//                 .style("opacity", 0.9)
//                 .style("left", (event.pageX + 15) + "px")
//                 .style("top", (event.pageY - 15) + "px");
//         })
//         .on("mousemove", function (event) {
//             // Move tooltip with the mouse
//             tooltip.style("left", (event.pageX + 15) + "px")
//                 .style("top", (event.pageY - 15) + "px");
//         })
//         .on("mouseout", function (event) {
//             // Hide tooltip on mouseout
//             tooltip.html(``)
//                 .style("opacity", 0);
//         });

//     svg.append("text")
//         .classed("scatter_text", true)
//         .attr("x", (width / 2))
//         .attr("y", (margin.top - 25))
//         .attr("text-anchor", "middle")
//         .style("font-size", "16px")
//         .text("Relationship between Sub-organizations");
// }
