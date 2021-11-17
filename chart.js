const chartWidth = 496 * 2;
const chartHeight = 496;

let overweightChart = d3.select("#overweightChart");
overweightChart.attr("width", chartWidth).attr("height", chartHeight);
let overweightChartGroup = overweightChart.append("g");

let x;

// Main function.
function main() {
  drawChart(netherlandsData); // Draw the chart.
}

// Function to draw the initial chart.
function drawChart(data) {
  const padding = 32;

  x = d3
    .scaleBand()
    .domain(d3.range(data.length))
    .range([0, chartWidth - padding * 2]);

  overweightChartGroup
    .append("g")
    .attr("id", "xAxis")
    .attr(
      "transform",
      `translate(${padding * 1.5}, ${chartHeight - padding + 8})`
    )
    .call(
      d3
        .axisBottom(x)
        .tickSizeOuter(0)
        .tickFormat(i => `${data[i].year}`)
    );

  const y = d3
    .scaleLinear()
    .domain([100, 0])
    .range([0, chartHeight - padding]);

  overweightChartGroup
    .append("g")
    .attr("id", "yAxis")
    .attr("transform", `translate(${padding * 1.5}, 8)`)
    .call(
      d3
        .axisLeft(y)
        .tickFormat(d => `${d}%`)
        .tickSizeOuter(0)
        .ticks(10)
    );

  updateChart(data);
}

// Function to update the chart on hover.
function updateChart(data) {}

// Function to rescale the x axis of the chart.
function rescale(data) {
  x.domain(d3.range(data.length));
  d3.select("#xAxis")
    .transition()
    .duration(500)
    .call(
      d3
        .axisBottom(x)
        .tickSizeOuter(0)
        .tickFormat(i => `${data[i].year}`)
    );
}

// Run the main function.
main();

// Event listener for the chart radio buttons.
d3.select("#netherlandsRadioButtons").on("change", e => {
  periodData = getPeriodData(e.target.id);
  rescale(periodData);
  updateChart(periodData);
});

// Get period data based on specified period.
function getPeriodData(period) {
  switch (period) {
    case "2000-2020":
      return netherlandsData;
    case "2010-2020":
      return netherlandsData.slice(10);
  }
}
