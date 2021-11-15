const exampleData = [
  {
    jaar: "2005-2007",
    Drenthe: 49.4,
    Flevoland: 52.7,
    Fryslân: 45.8,
    "Noord-Brabant": 45.9,
    Gelderland: 47.7,
    Limburg: 47.5,
    Overijssel: 47.2,
    "Zuid-Holland": 44.8,
    Groningen: 46.1,
    Zeeland: 44.9,
    "Noord-Holland": 43.2,
    Utrecht: 42.6
  },
  {
    jaar: "2008-2010",
    Drenthe: 51.8,
    Flevoland: 48.7,
    Fryslân: 45.0,
    "Noord-Brabant": 47.7,
    Gelderland: 49.7,
    Limburg: 50.4,
    Overijssel: 49.1,
    "Zuid-Holland": 48.2,
    Groningen: 51.3,
    Zeeland: 49.1,
    "Noord-Holland": 44.1,
    Utrecht: 40.7
  },
  {
    jaar: "2011-2013",
    Drenthe: 55.8,
    Flevoland: 55.7,
    Fryslân: 48.7,
    "Noord-Brabant": 48.3,
    Gelderland: 47.8,
    Limburg: 49.8,
    Overijssel: 48.2,
    "Zuid-Holland": 48.8,
    Groningen: 47.6,
    Zeeland: 52.2,
    "Noord-Holland": 45.4,
    Utrecht: 43.9
  },
  {
    jaar: "2014-2016",
    Drenthe: 54.4,
    Flevoland: 55.6,
    Fryslân: 53.5,
    "Noord-Brabant": 49.8,
    Gelderland: 51.6,
    Limburg: 52.1,
    Overijssel: 51.8,
    "Zuid-Holland": 51.8,
    Groningen: 49.6,
    Zeeland: 52.3,
    "Noord-Holland": 46.4,
    Utrecht: 44.9
  },
  {
    jaar: "2017-2019",
    Drenthe: 56.7,
    Flevoland: 55.8,
    Fryslân: 53.0,
    "Noord-Brabant": 52.4,
    Gelderland: 52.2,
    Limburg: 51.8,
    Overijssel: 51.2,
    "Zuid-Holland": 51.0,
    Groningen: 50.4,
    Zeeland: 50.1,
    "Noord-Holland": 47.8,
    Utrecht: 44.4
  }
];
const url = "https://cartomap.github.io/nl/wgs84/provincie_2021.geojson";
const mapWidth = 496;
const mapHeight = 496;

const legendWidth = 266;
const legendHeight = 64;

let overweightMap = d3.select("#overweightMap");
let overweightMapGroup = overweightMap.append("g");
let overweightMapLegend = d3.select("#overweightMapLegend");

let overweightChart = d3.select("#overweightChart");
let overweightChartGroup = overweightChart.append("g");
let overweightChartHeader = d3.select("#overweightChartHeader");

let geojsonData;
let path;
const color = d3.scaleLinear().domain([40, 60]).range(["lightblue", "blue"]);

async function main() {
  geojsonData = await fetchGeojsonData(); // Fetch the geojson data.
  const projection = d3
    .geoMercator()
    .fitSize([mapWidth, mapWidth], geojsonData); // Create the projection and path that are required to draw the map.
  path = d3.geoPath(projection);

  updateMap(geojsonData, exampleData[0], path);
  drawMapLegend();
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
function updateMap(geojsonData, overweightData, path) {
  overweightMapGroup
    .selectAll("path")
    .data(geojsonData.features)
    .join(
      enter => {
        return enter
          .append("path")
          .style("fill", d => color(overweightData[d.properties.statnaam]))
          .attr("class", d => `province ${d.properties.statnaam}`)
          .attr("d", path)
          .on("mouseover", handleMouseOver)
          .on("mouseout", handleMouseOut);
      },
      update => {
        return update
          .transition()
          .duration(500)
          .style("fill", d => color(overweightData[d.properties.statnaam]));
      }
    );
}

// Function to draw the legend for the map.
function drawMapLegend() {
  overweightMapLegend.attr("width", legendWidth).attr("height", legendHeight); // Set the width and height of the legend.

  // Dit is allemaal kaka moet echt anders
  const x = d3
    .scaleLinear()
    .domain([40, 60])
    .range([0, legendWidth - 32]);

  overweightMapLegend
    .append("g")
    .attr("transform", `translate(16, ${legendHeight / 2})`)
    .call(d3.axisBottom(x).ticks(5));

  overweightMapLegend
    .append("g")
    .selectAll("rect")
    .data([42.5, 47.5, 52.5, 57.5])
    .enter()
    .append("rect")
    .attr("width", (legendWidth - 32) / 4)
    .attr("height", legendHeight / 2)
    .attr(
      "transform",
      (d, i) => `translate(${((legendWidth - 32) / 4) * i + 16}, -16)`
    )
    .style("fill", d => color(d));
}

// Function to handle the mouseover event.
function handleMouseOver() {
  overweightChartHeader.text(`Overgewicht in ${this.classList[1]}`); // Update the text in the overweight chart header.
  updateChart();
}

// Function to handle the mouseout event.
function handleMouseOut() {
  overweightChartHeader.text("Overgewicht in Nederland"); // Reset the text in the overweight chart header.
}

// Function to update the chart on hover.
function updateChart() {}

// Run the main function
main();

// event listener for the radio buttons.
d3.select("#radioButtons").on("change", e => {
  console.log(e.target.id);
  updateMap(geojsonData, getExampleData(e.target.id), path);
});

function getExampleData(year) {
  switch (year) {
    case "2005-2007":
      return exampleData[0];
    case "2008-2010":
      return exampleData[1];
    case "2011-2013":
      return exampleData[2];
    case "2014-2016":
      return exampleData[3];
    case "2017-2019":
      return exampleData[4];
  }
}
