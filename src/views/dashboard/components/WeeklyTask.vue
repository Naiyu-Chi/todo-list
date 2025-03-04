<script setup>
  import { computed } from 'vue';
  import { Delete } from '@element-plus/icons-vue';
  import { useTodoStore } from '@/stores/modules/todo';
  const todoStore = useTodoStore();

  const props = defineProps({
    tasks: Array,
    isCurrentWeek: Boolean
  });

  // Sort tasks by date and start time
  const sortedTasks = computed(() => {
    return [...props.tasks].sort((a, b) => {
      // First sort by date
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA.getTime() !== dateB.getTime()) return dateA - dateB;
      
      // Then sort by start time
      return a.startTime.localeCompare(b.startTime);
    });
  });
  
  // Today date for highlighting
  const todayDate = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  
  // Set table row class
  const getRowClass = ({ row }) => {
    const classes = [];
    if (row.done) classes.push('task-done');
    
    const taskDate = new Date(row.date);
    taskDate.setHours(0, 0, 0, 0);
    const today = todayDate.value;
    
    if (taskDate.getTime() === today.getTime()) classes.push('task-today');
    
    return classes.join(' ');
  };
  
  // Format date 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
    const weekday = weekdays[date.getDay()];
    
    return `${month}/${day} ${weekday}`;
  };
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>{{ isCurrentWeek ? '本週' : '選定週' }}任務</span>
      </div>
    </template>
    
    <el-table 
      v-if="sortedTasks.length > 0" 
      :data="sortedTasks" 
      style="width: 100%"
      :row-class-name="getRowClass"
    >
      <el-table-column width="60">
        <template #default="scope">
          <el-checkbox 
            v-model="scope.row.done" 
            @change="() => todoStore.toggleDone(scope.row.id)"
          />
        </template>
      </el-table-column>
      
      <el-table-column prop="name" label="任務名稱" />
      
      <el-table-column label="日期 / 時間" width="220">
        <template #default="scope">
          {{ formatDate(scope.row.date) }} {{ scope.row.startTime }} - {{ scope.row.endTime }}
        </template>
      </el-table-column>
      
      <el-table-column width="100" align="right">
        <template #default="scope">
          <el-button 
            type="danger" 
            size="small" 
            @click="() => todoStore.deleteTodo(scope.row.id)"
            :icon="Delete"
            text
          >
            刪除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-empty v-else :description="`${isCurrentWeek ? '本週' : '選定週'}沒有任務`" />
  </el-card>
</template>
  
<style scoped>
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  /* :deep(.task-done) {
    color: #909399;
    text-decoration: line-through;
    opacity: 0.7;
  }
  
  :deep(.task-today) {
    background-color: #ecf5ff;
  } */
</style>