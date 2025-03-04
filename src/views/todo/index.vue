<script setup>
  // Components
  import Calendar from './components/Calendar.vue';
  import TodoDialog from '@/views/todo/components/TodoDialog.vue';

  // Custom Hooks
  import useCalendar from '@/hooks/useCalendar';
  import useDialog from '@/hooks/useDialog';

  // Pinia store
  import { useTodoStore } from '@/stores/modules/todo';
  const todoStore = useTodoStore();
  const { addTodo, updateTodo, deleteTodo } = todoStore;

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
    getFormData,
    validateForm
  } = useDialog();

  // Handlers
  function handleAddTask(date, startTime) {
    openDialogForAdd(date, startTime);
  }

  function handleSelectDate(date) {
    selectDate(date);
  }

  function handleDeleteTodo(){
    const success =  deleteTodo(selectedId.value)
    if(success){
      closeDialog()
    }
  }

  function confirmEdit() {
    const formData = getFormData();
    if(validateForm()){
      const success = isEditing.value  ? updateTodo(selectedId.value, formData) : addTodo(formData);
      if(success){
        closeDialog()
      }
    }
  }
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
      @toggle-add="handleAddTask"
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
      @delete="handleDeleteTodo"
    />
  </div>
</template>