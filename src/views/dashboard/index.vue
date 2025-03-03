<template>
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>待辦事項儀表板</h1>
        <div class="date-display"></div>
      </div>

      <!-- 統計數據  -->
      <div class="stats-container">
        <h2>本周進度追蹤</h2>
        <div class="stat-card">
          <h3>總任務 : {{ todoStore.todosByWeek.length }}</h3>
        </div>
        <div class="stat-card">
          <h3>已完成 : {{ todoStore.completedTodos.length }}</h3>
        </div>
        <div class="stat-card">
          <h3>進行中: {{ todoStore.onProgressTodos.length }}</h3>
        </div>
      </div>

      <!-- 本週任務分佈 -->
      <Chart :tasks="todoStore.todosByWeek" />
  </div>
</template>

<script setup>
  import Chart from '@/views/dashboard/components/chart.vue'
  import { useTodoStore } from '@/stores/modules/todo';
  const todoStore = useTodoStore();
</script>
  
<style scoped>
  .dashboard-container {
    background-color: #f5f7fa;
    padding: 20px;
    border-radius: 8px;
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    
    h1 {
      margin: 0;
      font-size: 24px;
      color: #303133;
    }
    
    .date-display {
      font-size: 16px;
      color: #606266;
    }
  }
</style>