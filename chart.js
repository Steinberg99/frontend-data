const chartWidth = 496 * 2;
const chartHeight = 496;

let overweightChart = d3.select("#overweightChart");
overweightChart.attr("width", chartWidth).attr("height", chartHeight);
let overweightChartGroup = overweightChart.append("g");

let x;
let y;

// Main function.
function main() {
  drawChart(netherlandsData); // Draw the chart.
}

// Function to draw the initial chart.
function drawChart(data) {
  const padding = 48;

  x = d3 // Scale band for the x axis.
    .scaleBand()
    .domain(d3.range(data.length))
    .range([0, chartWidth - padding * 2]);

  overweightChartGroup // Add the x axis to the svg element.
    .append("g")
    .attr("id", "xAxis")
    .attr("transform", `translate(${padding}, ${chartHeight - padding})`)
    .call(
      d3
        .axisBottom(x)
        .tickSizeOuter(0)
        .tickFormat(i => `${data[i].year}`)
    );

  y = d3 // Scale for the y axis.
    .scaleLinear()
    .domain([100, 0])
    .range([0, chartHeight - padding * 2]);

  overweightChartGroup // Add the y axis to the svg element.
    .append("g")
    .attr("id", "yAxis")
    .attr("transform", `translate(${padding}, ${padding})`)
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
function updateChart(data) {
  const padding = 48;
  const width = (chartWidth - 2 * padding) / data.length - 4; // Width of the bars.

  overweightChartGroup
    .selectAll("rect")
    .data(data)
    .join(
      enter => {
        return enter
          .append("rect")
          .transition()
          .duration(400)
          .attr("fill", d => color(d.overweight))
          .attr("width", width)
          .attr(
            "height",
            d => (d.overweight / 100) * (chartHeight - 2 * padding) // Calculate the height of the rectangle.
          )
          .attr(
            "transform",
            (d, i) =>
              `translate(${x(i) + padding + 3}, ${y(d.overweight) + padding})`
          );
      },
      update => {
        return update
          .transition()
          .duration(400)
          .attr("fill", d => color(d.overweight)) // Update the color
          .attr("width", (chartWidth - 2 * padding) / data.length - 8) // Update the width of the rectangle.
          .attr(
            "height",
            d => (d.overweight / 100) * (chartHeight - 2 * padding) // Update the height of the rectangles.
          )
          .attr(
            "transform",
            (d, i) =>
              `translate(${x(i) + padding + 5}, ${y(d.overweight) + padding})` // Update the transform of the rectangles.
          );
      },
      exit => {
        return exit.transition().duration(400).style("opacity", 0).remove(); // Delete left over rectangles.
      }
    );
}

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
