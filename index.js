const url = "https://cartomap.github.io/nl/wgs84/provincie_2021.geojson";
const mapWidth = 496;
const mapHeight = 496;

const legendWidth = 288;
const legendHeight = 36;

let overweightMap = d3.select("#overweightMap");
let overweightMapGroup = overweightMap.append("g");
let overweightMapLegend = d3.select("#overweightMapLegend");

let geojsonData;
let path;
const color = d3.scaleLinear().domain([40, 60]).range(["lightblue", "blue"]);

async function main() {
  geojsonData = await fetchGeojsonData(); // Fetch the geojson data.
  const projection = d3
    .geoMercator()
    .fitSize([mapWidth, mapWidth], geojsonData); // Create the projection and path that are required to draw the map.
  path = d3.geoPath(projection);

  updateMap(geojsonData, provinceData[0], path); // Draw the map for the first time.
  overweightMapLegend.attr("width", legendWidth).attr("height", legendHeight); // Set the width and height of the legend.
  drawMapLegend(); // Draw the map legend.
}

// Fetches the required geojson data.
async function fetchGeojsonData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

// Function to update the map based on new data.
function updateMap(geojsonData, data, path) {
  overweightMapGroup
    .selectAll("path")
    .data(geojsonData.features)
    .join(
      enter => {
        return enter
          .append("path")
          .style("fill", d => color(data[d.properties.statnaam]))
          .attr("class", d => `province ${d.properties.statnaam}`)
          .attr("d", path);
      },
      update => {
        return update
          .transition()
          .duration(500)
          .style("fill", d => color(data[d.properties.statnaam]));
      }
    );
}

// Function to draw the legend for the map.
function drawMapLegend() {
  const min = 40;
  const max = 60;
  const padding = 16;
  const tick = 5;
  const colorValues = [42.5, 47.5, 52.5, 57.5];

  const x = d3 // Create the scale for the legend.
    .scaleLinear()
    .domain([min, max])
    .range([0, legendWidth - padding * 2]);

  overweightMapLegend
    .append("g")
    .attr("transform", `translate(${padding}, ${padding})`)
    .call(
      d3
        .axisBottom(x)
        .tickFormat(d => `${d}%`) // Add a percentage to the ticks.
        .ticks(tick)
    ); // Devide the legend in four sections.

  overweightMapLegend // Add the colored rectangles to the legend based on the color values.
    .append("g")
    .selectAll("rect")
    .data(colorValues)
    .enter()
    .append("rect")
    .attr("width", (legendWidth - 2 * padding) / (tick - 1) + 1)
    .attr("height", padding)
    .attr(
      "transform",
      (d, i) =>
        `translate(${
          ((legendWidth - 2 * padding) / (tick - 1)) * i + padding
        }, 0)`
    )
    .style("fill", d => color(d));
}

// Run the main function
main();

// Event listener for the province radio buttons.
d3.select("#proviceRadioButtons").on("change", e => {
  updateMap(geojsonData, getProvinceData(e.target.id), path);
});

function getProvinceData(year) {
  switch (year) {
    case "2005-2007":
      return provinceData[0];
    case "2008-2010":
      return provinceData[1];
    case "2011-2013":
      return provinceData[2];
    case "2014-2016":
      return provinceData[3];
    case "2017-2019":
      return provinceData[4];
  }
}
