document.addEventListener("DOMContentLoaded", function () {
  // サンプルデータのロード
  const dataPath = "data.csv"; // CSVファイルへのパス
  const selectedMetrics = [];

  // データテーブルを初期化
  const table = $("#data-table").DataTable({
    ajax: {
      url: dataPath,
      dataSrc: "",
    },
    columns: [
      { data: "問番号" },
      { data: "設問内容の要約" },
      { data: "全体 (%)" },
      { data: "造血器腫瘍 (%)" },
      { data: "固形腫瘍 (脳腫瘍を除く) (%)" },
      { data: "脳腫瘍 (%)" },
    ],
  });

  // チャート描画
  const ctx = document.getElementById("comparison-chart").getContext("2d");
  let comparisonChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [],
      datasets: [],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "指標の比較" },
      },
    },
  });

  // 指標を選択して再描画
  document.getElementById("metric").addEventListener("change", function () {
    const selected = Array.from(this.selectedOptions).map((option) => option.value);
    selectedMetrics.splice(0, selectedMetrics.length, ...selected);

    updateChart();
  });

  // チャートを更新
  function updateChart() {
    table.ajax.reload(() => {
      const data = table.rows().data().toArray();
      const labels = data.map((row) => row["問番号"]);
      const datasets = selectedMetrics.map((metric) => ({
        label: metric,
        data: data.map((row) => parseFloat(row[metric])),
        backgroundColor: getRandomColor(),
      }));

      comparisonChart.data.labels = labels;
      comparisonChart.data.datasets = datasets;
      comparisonChart.update();
    });
  }

  // ランダムな色を生成
  function getRandomColor() {
    return `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
      Math.random() * 255
    )}, ${Math.floor(Math.random() * 255)}, 0.5)`;
  }
});
