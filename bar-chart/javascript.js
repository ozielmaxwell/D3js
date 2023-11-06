// Load the JSON data
d3.json("data.json").then(function(data) {
    // Create an SVG element for the map
    const svg = d3.select("#uk-map");

    // Define a projection (for simplicity, we'll use a basic projection)
    const projection = d3.geoIdentity().reflectY(true);

    // Create a path generator based on the projection
    const path = d3.geoPath().projection(projection);

    // Draw the towns on the map
    svg.selectAll(".town")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "town-circle")
        .attr("cx", d => projection([d.lng, d.lat])[0])
        .attr("cy", d => projection([d.lng, d.lat])[1])
        .attr("r", 5); // Set the radius of the town circles

    // You may want to add labels or tooltips for the towns
    // For example, you can use d3-tip or other techniques to display town names and population.
});
