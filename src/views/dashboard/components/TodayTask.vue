<template>
  <el-card v-if="isCurrentWeek">
    <!-- 卡片HEADER -->
    <template #header>
      <div class="today-header">
        <span>今日任務 ({{ tasks.length }})</span>
        <span>{{ formattedToday }}</span>
      </div>
    </template>
    
    <template v-if="tasks.length > 0">
      <el-progress 
        :percentage="completionRate" 
        :format="() => `${completedCount}/${tasks.length}`"
        :stroke-width="10"
        status="success"
      />
      
      <el-scrollbar height="250px">
        <div v-if="tasks.length > 0" class="task-list">
          <div 
            v-for="task in tasks" 
            :key="task.id"
            class="task-item"
            :class="{ 'task-done': task.done }"
          >
            <div class="task-checkbox">
              <el-checkbox 
                v-model="task.done" 
                @change="() => todoStore.toggleDone(task.id)"
              />
            </div>
            <div class="task-content">
              <div class="task-name">{{ task.name }}</div>
              <div class="task-time">{{ task.startTime }} - {{ task.endTime }}</div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </template>
    <el-empty v-else description="今日沒有任務" />
  </el-card>
</template>
  
<script setup>
  import { computed } from 'vue';
  import { useTodoStore } from '@/stores/modules/todo';
  
  const props = defineProps({
    isCurrentWeek: Boolean,
    calendar: Object
  });
  
  const todoStore = useTodoStore();
  
  const todayDate = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  
  const formattedToday = computed(() => {
    return props.calendar.formatDate(todayDate.value);
  });
  
  const tasks = computed(() => {
    const today = todayDate.value;
    return todoStore.todos.filter(task => {
      const taskDate = new Date(task.date);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    });
  });
  
  const completedCount = computed(() => {
    return tasks.value.filter(task => task.done).length;
  });
  
  const completionRate = computed(() => {
    const totalTasks = tasks.value.length;
    if (totalTasks === 0) return 0;
    
    return Math.round((completedCount.value / totalTasks) * 100);
  });
</script>
  
<style lang="scss" scoped>
  .today-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .task-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #ebeef5;
    transition: background-color 0.3s;
    &:hover{
      background-color: #f5f7fa;
    }

    .task-checkbox {
      margin-right: 16px;
    }
    .task-content {
      display: flex;
      flex-direction: column;
    }
    
    .task-name {
      font-size: 15px;
      color: #303133;
    }
    
    .task-time {
      font-size: 12px;
      color: #909399;
      margin-top: 4px;
    }
  }
</style>