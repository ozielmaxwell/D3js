const width = 1000;
const height = 900;

const path = d3.geoPath();
const projection = d3.geoAlbersUsa().scale(1300).translate([width / 2, height / 2]);

const svg = d3.create('svg')
  .attr('height', height)
  .attr('width', width);
const stateBackground = svg.append('path')
  .attr('fill', '#ddd');
const stateBorder = svg.append('path')
  .attr('fill', 'none')
  .attr('stroke', '#fff')
  .attr('stroke-linejoin', 'round')
  .attr('stroke-linecap', 'round');

document.body.appendChild(svg.node());

// Use the fetch API to load the JSON data for the US
fetch('./us.json')
  .then(response => response.json())
  .then(us => {
    stateBackground.attr('d', path(topojson.feature(us, us.objects.nation)));
    stateBorder.attr('d', path(topojson.mesh(us, us.objects.states, (a, b) => a !== b)));
  })
  .catch(error => {
    console.error('Failed to load us.json:', error);
  });

// Use the fetch API to load the JSON data
fetch('./data.json')
  .then(response => response.json())
  .then(data => {
    // Check if data is null or empty
    if (data && data.length > 0) {
      // Continue with data processing
      const stateCapitalElement = svg.selectAll('g')
        .data(data)
        .enter() // Add this to create elements for each data point
        .append('g')
        .attr('transform', d => `translate(${projection([d.longitude, d.latitude]).join(",")})`)
        .append('circle')
        .attr('r', 5)
        .append('text')
        .attr('y', -6)
        .text(d => d.description);
      console.log(data);
    } else {
      console.error('Loaded data is empty or not an array.');
    }
  })
  .catch(error => {
    console.error('Failed to load data.json:', error);
  });
