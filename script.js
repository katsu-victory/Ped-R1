document.addEventListener("DOMContentLoaded", function () {
  // データ読み込み
  d3.csv("data.csv").then(function (data) {
    // 初期値
    const metricSelector = document.getElementById("metric");
    const chartContainer = d3.select("#chart");

    // グラフを描画する関数
    function drawChart(metric) {
      chartContainer.html(""); // 既存のグラフをクリア

      const svg = chartContainer
        .append("svg")
        .attr("width", 800)
        .attr("height", 400);

      const xScale = d3
        .scaleBand()
        .domain(data.map((d) => d["問番号"]))
        .range([50, 750])
        .padding(0.1);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => +d[metric])])
        .range([350, 50]);

      // 軸の描画
      svg
        .append("g")
        .attr("transform", "translate(0,350)")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

      svg.append("g").attr("transform", "translate(50,0)").call(d3.axisLeft(yScale));

      // 棒グラフ
      svg
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => xScale(d["問番号"]))
        .attr("y", (d) => yScale(+d[metric]))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => 350 - yScale(+d[metric]))
        .attr("fill", "#69b3a2");
    }

    // 初期描画
    drawChart("overall");

    // セレクターの変更イベント
    metricSelector.addEventListener("change", function () {
      drawChart(this.value);
    });
  });
});
