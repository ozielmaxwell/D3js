
const width = 960;
const height = 1160;

const reloadButton = document.getElementById('reloadButton');
reloadButton.addEventListener('click', reloadData);

const svg = d3.create('svg')
  .attr('height', height)
  .attr('width', width);

const projection = d3.geoAlbers()
                    .center([0, 55.4])
                    .rotate([4.4, 0])
                    .parallels([50, 60])
                    .scale(6000)
                    .translate([width / 2, height / 2]);
const path = d3.geoPath()
                .projection(projection);


const tooltip = d3.select('#tooltip');



document.body.appendChild(svg.node());


function reloadData(){
// Use the fetch API to load the JSON data for the UK
fetch('https://bost.ocks.org/mike/map/uk.json')
  .then(response => response.json())
  .then(uk => {
    
    const subunits = topojson.feature(uk, uk.objects.subunits);
    svg.selectAll(".subunit")
        .data(topojson.feature(uk, uk.objects.subunits).features)
        .enter()
        .append("path")
        .attr("class", function(d) { return "subunit " + d.id; })
        .attr("d", path);

    svg.append("path")
        .datum(topojson.mesh(uk, uk.objects.subunits, function(a, b) { return a !== b && a.id !== "IRL"; }))
        .attr("d", path)
        .attr("class", "subunit-boundary");

    svg.append("path")
        .datum(topojson.mesh(uk, uk.objects.subunits, function(a, b) { return a === b && a.id === "IRL"; }))
        .attr("d", path)
        .attr("class", "subunit-boundary IRL");
    
    svg.selectAll(".subunit-label")
        .data(topojson.feature(uk, uk.objects.subunits).features)
      .enter().append("text")
        .attr("class", function(d) { return "subunit-label " + d.id; })
        .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.properties.name; });
  }).catch(error => {
    console.error('Failed to load uk json data:', error);
  });

// Use the fetch API to load the JSON towns data
fetch('http://34.38.72.236/Circles/Towns/50')
  .then(response => response.json())
  .then(data => {
    // Check if data is null or empty
    if (data && data.length > 0) {
      
        const town = svg.selectAll("g")
                        .data(data)
                        .enter();
        const towns = town.append('g')
                        .attr('transform', data => `translate(${projection([data.lng, data.lat]).join(",")})`)
                towns.append('circle')
                    .attr('r', 4)
                    .style('fill','#250c01')
                    .on('mouseover', function (event, data) {
                        showTooltip(event, data);
                    })
                    .on('mouseout', hideTooltip);;
                    // .append('title')
                    // .html(data => {
                    //     return `<tspan>County: ${data.County}</tspan><tspan dy="1.2em"> Population: ${data.Population}</tspan>`;
                    // });
                towns.append('text')
                    .attr('y', -5)
                    .text(data => data.Town)
                    .attr('text-anchor', 'left')
                    .attr('font-family', 'Tahoma')
                    .attr('font-size', 12);

                    function showTooltip(event, data) {
                        tooltip.html(`<strong>Location Details</strong><p>County: ${data.County}</p><p>Town: ${data.Town}</p><p>Population: ${data.Population}</p>`)
                            .style('left', (event.pageX + 10) + 'px')
                            .style('top', (event.pageY - 20) + 'px')
                            .style('display', 'block');
                    }
                    
                    function hideTooltip() {
                        tooltip.style('display', 'none');
                    }

    } else {
      console.error('Loaded data is empty or not an array.');
    }
  })
  .catch(error => {
    console.error('Failed to load circle data', error);
  });
};

reloadData();
