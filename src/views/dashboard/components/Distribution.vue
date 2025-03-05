<template>
  <div class="weekly-chart-container">
    <h3>週任務分佈</h3>
    <div v-if="tasks.length > 0" class="chart-wrapper">
      <div class="chart-container">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </div>
    <el-empty v-else description="當周沒有任務" />
  </div>
</template>

<script setup>
  import { computed } from "vue";
  import { Bar } from "vue-chartjs";
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const props = defineProps({
    tasks: {
      type: Array,
      default: () => [],
    },
    currentDate: {
      type: Object,
      default: () => new Date(),
    },
  });

  // 計算每日任務數據
  const dailyTaskData = computed(() => {
    const daysOfWeek = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
    const counts = Array(7).fill(0);

    // 計算每日任務數量
    if (props.tasks && props.tasks.length > 0) {
      props.tasks.forEach((task) => {
        if (task && task.date) {
          const date = new Date(task.date);
          const dayIndex = date.getDay(); // 0: Sunday, 1: Monday ... etc
          counts[dayIndex] += 1;
        }
      });
    }

    return { labels: daysOfWeek, counts };
  });

  const maxCount = computed(() => {
    const max = Math.max(...dailyTaskData.value.counts);
    return max > 0 ? max : 1; 
  });

  // 圖表數據
  const chartData = computed(() => ({
    labels: dailyTaskData.value.labels,
    datasets: [
      {
        label: "任務數量",
        data: dailyTaskData.value.counts,
        backgroundColor: dailyTaskData.value.counts.map((count) =>
          count > 0
            ? `rgba(100, 181, 246, ${0.5 + (count / maxCount.value) * 0.5})`
            : "rgba(100, 181, 246, 0.5)"
        ),
        borderColor: "#1976D2",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }));

  // 圖表選項
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true, 
    plugins: {
      legend: {
        display: false, 
      },
      tooltip: {
        callbacks: {
          title: function (context) {
            return context[0].label;
          },
          label: function (context) {
            return `任務數量: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0, // 確保只顯示整數
        },
        title: {
          display: true,
          text: "任務數量",
        },
      },
    },
    animation: {
      duration: 500, // 縮短動畫時間，減少渲染負擔
    },
    layout: {
      padding: 10,
    },
  };
</script>

<style lang="scss" scoped>
  .weekly-chart-container {
    background-color: white;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    height: 100%;
    display: flex;
    flex-direction: column;
    max-height: 350px; /* 限制最大高度 */
    overflow: hidden; /* 防止內容溢出 */
  }

  h3 {
    margin-top: 0;
    margin-bottom: 16px;
    color: #303133;
    font-size: 18px;
  }

  .chart-wrapper {
    flex-grow: 0; /* 避免無限增長 */
    width: 100%;
    position: relative;
    .chart-container {
      height: 250px;
      width: 100%;
      position: relative;
      display: flex;
      justify-content: center;
    }
  }
</style>
