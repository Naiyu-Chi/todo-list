<script setup>
  // Components
  import WeekNavigator from '@/views/dashboard/components/WeekNavigator.vue';
  import Cards from './components/Cards.vue';
  import TodayTasks from './components/TodayTask.vue';
  import WeeklyTask from './components/WeeklyTask.vue';
  import Chart from '@/views/dashboard/components/Chart.vue';
  import WeeklyDistribution from '@/views/dashboard/components/Distribution.vue';

  // Hooks
  import { onMounted, watch } from 'vue';
  import useCalendar from '@/hooks/useCalendar';
  const calendar = useCalendar();
  const { weekStart, weekEnd, isCurrentWeek } = calendar;

  // Stores
  import { useTodoStore } from '@/stores/modules/todo';
  const todoStore = useTodoStore();
  
  onMounted(() => {
    todoStore.setSelectedWeek(weekStart.value, weekEnd.value);
  });
  
  watch([weekStart, weekEnd], ([newStart, newEnd]) => {
    todoStore.setSelectedWeek(newStart, newEnd);
  });
</script>

<template>
  <div class="dashboard-container">
    <!-- 頁面標題 -->
    <el-row :gutter="20" class="mb-4">
      <el-col :span="24">
        <h1>待辦事項儀表板</h1>
      </el-col>
    </el-row>

    <!-- 週次導航 -->
    <WeekNavigator 
      :calendar="calendar" 
      :weekStart="weekStart" 
      :weekEnd="weekEnd" 
    />

    <!-- 統計卡片 -->
    <div class="mb-4">
      <Cards 
        :totalTasks="todoStore.todosByWeek.length"
        :completedTasks="todoStore.completedTodos.length"
        :inProgressTasks="todoStore.onProgressTodos.length"
      />
    </div>

    <!-- 今日任務區塊 -->
    <div class="mb-4">
      <TodayTasks :isCurrentWeek="isCurrentWeek" />
    </div>

    <!-- 圖表區域 -->
    <el-row :gutter="20" class="mb-4">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <Chart 
          :completedCount="todoStore.completedTodos.length" 
          :inProgressCount="todoStore.onProgressTodos.length"
        />
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <WeeklyDistribution :tasks="todoStore.todosByWeek" :currentDate="calendar.currentDate" />
      </el-col>
    </el-row>
    <!-- 本週任務列表 -->
    <!-- <WeeklyTask
      :tasks="todoStore.todosByWeek" 
      :isCurrentWeek="isCurrentWeek"
    /> -->
  </div>
</template>

<style scoped>
  .dashboard-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .mb-4 {
    margin-bottom: 20px;
  }
</style>