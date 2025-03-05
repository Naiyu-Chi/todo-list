<script setup>
  // Components
  import Calendar from "./components/Calendar.vue";
  import TodoDialog from "@/views/todo/components/TodoDialog.vue";

  // Custom Hooks
  import { onMounted } from "vue";
  import useCalendar from "@/hooks/useCalendar";
  import useDialog from "@/hooks/useDialog";

  // Pinia store
  import { useTodoStore } from "@/stores/modules/todo";
  const todoStore = useTodoStore();
  const { addTodo, updateTodo, deleteTodo, fetchTodos } = todoStore;

  const calendar = useCalendar();
  const {
    weekDays,
    timePeriods,
    currentMonthYear,
    selectedDate,
    goToToday,
    goToPreviousWeek,
    goToNextWeek,
    selectDate,
  } = calendar;

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

  // 處理新增任務
  function handleAddTask(date, startTime) {
    openDialogForAdd(date, startTime);
  }

  // 處理選擇日期
  function handleSelectDate(date) {
    selectDate(date);
  }

  // 處理刪除待辦事項
  function handleDeleteTodo() {
    const success = deleteTodo(selectedId.value);
    if (success) {
      closeDialog();
    }
  }

  // 處理切換待辦事項完成狀態
  function handleToggleTodo() {
    todoStore.toggleDone(selectedId.value);
  }

  // 確認編輯或新增表單
  function confirmEdit() {
    const formData = getFormData();
    if (validateForm()) {
      console.log(formData);
      const success = isEditing.value
        ? updateTodo(selectedId.value, formData)
        : addTodo(formData);
      if (success) {
        closeDialog();
      }
    }
  }

  onMounted(() => {
    fetchTodos();
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
        @toggle-done="handleToggleTodo"
      />
    </div>
</template>
