<template>
  <div class="chart-container">
    <h3>任務完成狀態</h3>
    <div v-if="hasData" class="chart-wrapper">
      <!-- 使用固定高度的容器 -->
      <div class="chart">
        <Pie :data="chartData" :options="chartOptions" />
      </div>
      <!-- 圖表說明欄位 -->
      <div class="legend">
        <div class="legend-item">
          <div class="color-box" style="background-color: #41b883"></div>
          <span>已完成</span>
        </div>
        <div class="legend-item">
          <div class="color-box" style="background-color: #64b5f6"></div>
          <span>進行中</span>
        </div>
      </div>
    </div>
    <el-empty v-else description="當周沒有任務" />
  </div>
</template>

<script setup>
  import { computed } from "vue";
  import { Pie } from "vue-chartjs";
  import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

  ChartJS.register(ArcElement, Tooltip, Legend, Title);

  const props = defineProps({
    completedCount: Number,
    inProgressCount: Number,
  });

  // 計算屬性，判斷是否有資料
  const hasData = computed(() => {
    return props.completedCount > 0 || props.inProgressCount > 0;
  });

  // 圖表數據
  const chartData = computed(() => ({
    labels: ["已完成", "進行中"],
    datasets: [
      {
        backgroundColor: ["#41B883", "#64B5F6"],
        data: [props.completedCount, props.inProgressCount],
        borderWidth: 0,
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
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = props.completedCount + props.inProgressCount;
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "30%", // 圓餅圖中心比例
    radius: "80%",
  };
</script>

<style lang="scss" scoped>
  .chart-container {
    background-color: white;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    height: 100%;
    display: flex;
    flex-direction: column;
    max-height: 350px;
    h3 {
      margin-top: 0;
      margin-bottom: 16px;
      color: #303133;
      font-size: 18px;
    }
    .chart-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-grow: 0;
    }
    .chart {
      width: 100%;
      max-height: 250px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .legend {
    display: flex;
    justify-content: center;
    margin-top: 16px;
    gap: 20px;
  }

  .legend-item {
    display: flex;
    align-items: center;
  }

  .color-box {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    border-radius: 3px;
  }
</style>
