<script setup>
import { onMounted } from 'vue';
import { ElMessage } from 'element-plus';
// Components
import Calendar from './components/Calendar.vue';
import TodoDialog from '@/views/todo/components/TodoDialog.vue';

// Custom Hooks
import useCalendar from '@/hooks/useCalendar';
import useDialog from '@/hooks/useDialog';

// Pinia store
import { useTodoStore } from '@/stores/modules/todo';
const todoStore = useTodoStore();

// Hooks
const {
  weekDays,
  timePeriods,
  currentMonthYear,
  selectedDate,  
  goToToday,
  goToPreviousWeek,
  goToNextWeek,
  selectDate,
} = useCalendar();

const {
  dialogFormVisible,
  isEditing,
  dialogTitle,
  selectedId,
  form,
  openDialogForAdd,
  openDialogForEdit,
  closeDialog,
  getFormData
} = useDialog();

// Handelers
function handleAddTask(date) {
  openDialogForAdd(date);
}

function handleSelectDate(date) {
  selectDate(date);
}

function handleDeleteTodo(id){
  todoStore.deleteTodo(id)
}

function handleToggleTodo(id){
  todoStore.toggleDone(id)
}

async function confirmEdit() {
  const formData = getFormData();
  if (isEditing.value) {
    if (!selectedId.value) {
      ElMessage.error('找不到要更新的項目');
      return;
    }
    await todoStore.updateTodo(selectedId.value, formData);
    closeDialog();
  } else {
    todoStore.addTodo(formData)
  }
}


onMounted(() => {
  todoStore.fetchTodos();
});
</script>

<template>
  <div class="todo-app">
    <!-- 週行事曆組件 -->
    <Calendar 
      :todos="todoStore.todos"
      :weekDays="weekDays"
      :timePeriods="timePeriods"
      :currentMonthYear="currentMonthYear"
      @previous-week="goToPreviousWeek"
      @next-week="goToNextWeek"
      @go-today="goToToday"
      @select-date="handleSelectDate"
      @add-task="handleAddTask"
      @delete-todo="handleDeleteTodo"
      @toggle-todo="handleToggleTodo"
      @toggle-edit="openDialogForEdit"
    >
      <template #header-actions>
        <el-button type="primary" @click="openDialogForAdd(selectedDate)">
          新增事項
        </el-button>
      </template>
    </Calendar>

    <!-- 編輯彈窗組件 -->
    <TodoDialog 
      v-model:visible="dialogFormVisible"
      :title="dialogTitle"
      :form="form"
      :isEditing="isEditing"
      @cancel="closeDialog"
      @confirm="confirmEdit"
    />
  </div>
</template>