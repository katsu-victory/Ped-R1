document.addEventListener("DOMContentLoaded", function () {
  const dataPath = "data.csv"; // CSVファイルのパス
  const tableElement = document.getElementById("data-table");
  const chartElement = document.getElementById("chart");
  const questionSelect = document.getElementById("question-select");
  const metricSelect = document.getElementById("metric-select");

  let table;
  let chart;

  // データを読み込む
  d3.csv(dataPath).then((data) => {
    // 問番号の選択肢を作成
    const uniqueQuestions = [...new Set(data.map((d) => d["問番号"]))];
    uniqueQuestions.forEach((question) => {
      const option = document.createElement("option");
      option.value = question;
      option.textContent = question;
      questionSelect.appendChild(option);
    });

    // DataTableの初期化
    table = $(tableElement).DataTable({
      data: data,
      columns: [
        { data: "問番号" },
        { data: "設問内容の要約" },
        { data: "全体 (%)" },
        { data: "造血器腫瘍 (%)" },
        { data: "固形腫瘍 (脳腫瘍を除く) (%)" },
        { data: "脳腫瘍 (%)" },
      ],
    });

    // チャートの初期化
    chart = new Chart(chartElement, {
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

    // イベントリスナーを追加
    questionSelect.addEventListener("change", () => updateChart(data));
    metricSelect.addEventListener("change", () => updateChart(data));
  });

  function updateChart(data) {
    const selectedQuestions = Array.from(questionSelect.selectedOptions).map((o) => o.value);
    const selectedMetrics = Array.from(metricSelect.selectedOptions).map((o) => o.value);

    const filteredData = data.filter((d) => selectedQuestions.includes(d["問番号"]));
    const labels = filteredData.map((d) => d["問番号"]);
    const datasets = selectedMetrics.map((metric) => ({
      label: metric,
      data: filteredData.map((d) => parseFloat(d[metric])),
      backgroundColor: getRandomColor(),
    }));

    chart.data.labels = labels;
    chart.data.datasets = datasets;
    chart.update();
  }

  function getRandomColor() {
    return `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
      Math.random() * 255
    )}, 0.5)`;
  }
});
