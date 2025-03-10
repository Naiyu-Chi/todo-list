<script setup>
  import { ref, onMounted, nextTick } from "vue";
  // Components
  import WeekCalendar from "./components/WeekCalendar.vue";
  import MonthCalendar from './components/MonthCalendar.vue';
  import TodoDialog from "@/views/todo/components/TodoDialog.vue";

  // Custom Hooks
  import useCalendar from "@/hooks/useCalendar";
  import useDialog from "@/hooks/useDialog";

  // Pinia store
  import { useTodoStore } from "@/stores/modules/todo";
  const todoStore = useTodoStore();
  const { fetchTodos } = todoStore;

  const calendar = useCalendar();
  const {
    weekDays,
    timePeriods,
    currentMonthYear,
    currentDate,
    selectedDate,
    goToToday,
    goToPreviousWeek,
    goToNextWeek,
    selectDate,
  } = calendar;

  const {
    openDialogForAdd,
    openDialogForEdit,
  } = useDialog();

  const displayWeek = ref(true); // 預設顯示週行事曆

  // 處理新增任務
  function handleAddTask(date, startTime) {
    openDialogForAdd(date, startTime);
  }

  // 處理選擇日期
  function handleSelectDate(date) {
    selectDate(date);
  }

  // 切換週視圖 & 月視圖
  function handleToggleCalendar(date){
    displayWeek.value = !displayWeek.value;
    nextTick(()=>{
      currentDate.value = new Date(date);
      selectedDate.value = date;
    })
  }

  onMounted(() => {
    fetchTodos();
  });
</script>

<template>
  <div class="todo-app">
    <el-button-group>
      <el-button @click="displayWeek=!displayWeek" :type="displayWeek ? 'primary' : 'default'" >週視圖</el-button>
      <el-button @click="displayWeek=!displayWeek" :type="!displayWeek ? 'primary' : 'default'" >月視圖</el-button>
    </el-button-group>
    
    <!-- 週行事曆組件 -->
    <WeekCalendar
      v-if="displayWeek"
      :weekDays="weekDays"
      :timePeriods="timePeriods"
      :currentMonthYear="currentMonthYear"
      :selectDate="selectDate"
      @select-date="handleSelectDate"
      @toggle-add="handleAddTask"
      @toggle-edit="openDialogForEdit"
    >
      <template #header-actions>
        <el-button-group>
          <el-button @click="goToPreviousWeek">上一週</el-button>
          <el-button @click="goToToday">今天</el-button>
          <el-button @click="goToNextWeek">下一週</el-button>
        </el-button-group>
        <el-button type="primary" @click="openDialogForAdd(selectedDate)">
          新增事項
        </el-button>
      </template>
    </WeekCalendar>

    <!-- 月行事曆組件 -->
    <MonthCalendar 
      v-if="!displayWeek" 
      :todos="todoStore.todos"
      @toggle-calendar="handleToggleCalendar"
    />

    <!-- 編輯彈窗組件 -->
    <TodoDialog />
  </div>
</template>