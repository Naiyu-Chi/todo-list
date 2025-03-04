<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1>待辦事項儀表板</h1>
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

    <!-- 完成率圓餅圖 -->
    <Chart 
      :completedCount="todoStore.completedTodos.length" 
      :inProgressCount="todoStore.onProgressTodos.length"
    />
    <WeeklyDistribution :tasks="todoStore.todosByWeek" />
  </div>
</template>

<script setup>
  import Chart from '@/views/dashboard/components/Chart.vue'
  import { useTodoStore } from '@/stores/modules/todo';
  import WeeklyDistribution from '@/views/dashboard/components/Distribution.vue';
  import TaskTimeline from './components/Timeline.vue'; 
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
  }
  
  .dashboard-header h1 {
    margin: 0;
    font-size: 24px;
    color: #303133;
  }
  
  .dashboard-header .date-display {
    font-size: 16px;
    color: #606266;
  }
  
  .stats-container {
    margin-bottom: 24px;
  }
  
  .stat-card {
    background-color: white;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  
  .stat-card h3 {
    margin: 0;
    font-size: 18px;
    color: #303133;
  }
</style>