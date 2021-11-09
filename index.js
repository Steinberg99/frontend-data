const url = "https://cartomap.github.io/nl/wgs84/provincie_2021.geojson";
const width = 384;
const height = 384;
const exampleData = {
  Groningen: 50.2,
  Fryslân: 51,
  Drenthe: 53.5,
  Overijssel: 51.8,
  Flevoland: 52.9,
  Gelderland: 50.5,
  Utrecht: 44.3,
  "Noord-Holland": 45.3,
  "Zuid-Holland": 49.7,
  Zeeland: 51.9,
  "Noord-Brabant": 50.7,
  Limburg: 53.3
};

let overweightChartHeader = d3.select("#overweightChartHeader");

async function main() {
  const geojsonData = await fetchGeojsonData(); // Fetch the geojson data.
  const projection = d3.geoMercator().fitSize([width, height], geojsonData); // Create the projection that is required to draw the map.
  const path = d3.geoPath(projection);

  let overweightMap = d3.select("#overweightMap");
  let obesityMap = d3.select("#obesityMap");
  let fastFoodMap = d3.select("#fastFoodMap");

  let overweightMapGroup = overweightMap.append("g");
  let obesityMapGroup = obesityMap.append("g");
  let fastFoodMapGroup = fastFoodMap.append("g");

  drawMap(overweightMapGroup, geojsonData, path); // Draw the overweight map.
  drawMap(obesityMapGroup, geojsonData, path); // Draw the obesity map.
  drawMap(fastFoodMapGroup, geojsonData, path); // Draw the fast food map.
}

function drawMap(group, geojsonData, path) {
  group
    .selectAll("path")
    .data(geojsonData.features)
    .enter()
    .append("path")
    .attr("class", d => `province ${d.properties.statnaam}`)
    .style("fill", d => color(exampleData[d.properties.statnaam]))
    .attr("d", path)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);
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

// Retrieves a color based on the provided overweight percentage.
function color(x) {
  if (x <= 45) return "#E05256";
  else if (x > 45 && x <= 47.5) return "#DD4045";
  else if (x > 47.5 && x <= 50) return "#DA2F35";
  else if (x > 50 && x <= 52.5) return "#D0252A";
  else return "#BF2227";
}

// Function to handle the mouseover event.
function handleMouseOver() {
  overweightChartHeader.text(`Overgewicht in ${this.classList[1]}`);
}

// Function to handle the mouseout event.
function handleMouseOut() {
  overweightChartHeader.text("Bla");
}

// Run the main function
main();
