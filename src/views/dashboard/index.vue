<script setup>
  // Components
  import WeekNavigator from "@/views/dashboard/components/WeekNavigator.vue";
  import Cards from "./components/Cards.vue";
  import TodayTasks from "./components/TodayTask.vue";
  import Chart from "@/views/dashboard/components/Chart.vue";
  import WeeklyDistribution from "@/views/dashboard/components/Distribution.vue";

  // Hooks
  import { computed, onMounted } from "vue";
  import useCalendar from "@/hooks/useCalendar";

  const calendar = useCalendar();
  const { weekStart, weekEnd, isCurrentWeek, formatDate } = calendar;

  // Stores
  import { useTodoStore } from "@/stores/modules/todo";
  const todoStore = useTodoStore();

  // 當週的任務
  const weeklyTodos = computed(() => {
    return todoStore.getTodosByDateRange(weekStart.value, weekEnd.value);
  });

  // 已完成任務
  const completedTodos = computed(() => {
    return todoStore.getCompletedTodos(weeklyTodos.value);
  });

  // 進行中任務
  const inProgressTodos = computed(() => {
    return todoStore.getInProgressTodos(weeklyTodos.value);
  });

  onMounted(() => {
    todoStore.fetchTodos();
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
    />
    <!-- 統計卡片 -->
    <div class="mb-4">
      <Cards
        :totalTasks="weeklyTodos.length"
        :completedTasks="completedTodos.length"
        :inProgressTasks="inProgressTodos.length"
      />
    </div>
    <!-- 今日任務區塊 -->
    <div class="mb-4">
      <TodayTasks :isCurrentWeek="isCurrentWeek" :calendar="calendar"/>
    </div>
    <!-- 圖表區域 -->
    <el-row :gutter="20" class="mb-4">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <Chart
          :completedCount="completedTodos.length"
          :inProgressCount="inProgressTodos.length"
        />
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <WeeklyDistribution
          :tasks="weeklyTodos"
          :currentDate="calendar.currentDate"
        />
      </el-col>
    </el-row>
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
