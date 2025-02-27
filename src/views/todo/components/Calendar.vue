<script setup>
  import { defineProps } from 'vue';
  // Props
  const props = defineProps({
      todos: {
          type: Array,
          default: () => []
      },
      weekDays: {
          type: Array,
          required: true
      },
      timePeriods: {
          type: Array,
          required: true
      },
      currentMonthYear: {
          type: String,
          required: true
      }
  });

  // Emits
  const emit = defineEmits(['previous-week', 'next-week', 'go-today', 'select-date', 'add-task', 'delete-todo', 'toggle-edit']);

  // Event handlers
  function handleSelectDate(day) {
      emit('select-date', day.formattedDate); 
  }

  function handleAddTask(date) {
    emit('add-task', date);
  }

  function goToPreviousWeek() {
    emit('previous-week');
  }

  function goToNextWeek() {
    emit('next-week');
  }

  function goToToday() {
    emit('go-today');
  }

  function deleteTodo(id) {
    emit('delete-todo', id); 
  }

  function toggleTodo(id){
    emit('toggle-todo', id)
  }

  function getTodosStartingAtTimeSlot(date, timeSlot) {
    if (!props.todos || props.todos.length === 0) return [];
    
    const slotHour = parseInt(timeSlot.split(':')[0]);
    
    return props.todos.filter(todo => {
      if (todo.date !== date) return false;
      
      const startHour = parseInt(todo.startTime?.split(':')[0] || '0');
      
      return startHour === slotHour;
    });
  }

  function getEventDurationInHours(todo) {
    if (!todo.startTime || !todo.endTime) return 1;
    
    const startHour = parseInt(todo.startTime.split(':')[0]);
    const endHour = parseInt(todo.endTime.split(':')[0]);
    
    return endHour - startHour;
  }

  function handleCellClick(event, date, time) {
    if (event.target.classList.contains('time-cell')) {
      console.log(date, time)
      handleAddTask(date, time);
    }
  }
</script>

<template>
  <div class="calendar-container">
    <!-- 表格HEADER -->
    <div class="calendar-header">
      <div class="calendar-nav">
        <el-button-group>
          <el-button @click="goToPreviousWeek">上一周</el-button>
          <el-button @click="goToToday">今天</el-button>
          <el-button @click="goToNextWeek">下一周</el-button>
        </el-button-group>
        <h2 class="month-year">{{ currentMonthYear }}</h2>
      </div>
      <div class="view-actions">
        <slot name="header-actions"></slot>
      </div>
    </div>

    <!-- 表格BODY -->
    <div class="week-view">
      <!-- Days of week header -->
      <div class="days-header">
        <div class="time-column"></div>
        <div v-for="day in weekDays" :key="day.formattedDate" 
             class="day-column-header"
             :class="{ 'today': day.isToday, 'selected': day.isSelected }"
             @click="handleSelectDate(day)">
          <div class="day-name">{{ day.dayName }}</div>
          <div class="day-number" :class="{ 'current-day': day.isToday }">
            {{ day.dayNumber }}
          </div>
        </div>
      </div>

      <!-- 左側時間欄位 -->
      <div class="time-grid">
        <div class="time-labels">
          <div v-for="time in timePeriods" :key="time" class="time-label">
            {{ time }}
          </div>
        </div>
        <!-- 右側主要欄位 -->
        <div class="day-columns">
            <div v-for="day in weekDays" :key="day.formattedDate" class="day-column" :class="{ 'today': day.isToday, 'selected': day.isSelected }">
                <div v-for="time in timePeriods" :key="`${day.formattedDate}-${time}`" 
                     class="time-cell" 
                     @click="handleCellClick($event, day.formattedDate, time)">
                    <div v-for="todo in getTodosStartingAtTimeSlot(day.formattedDate, time)" 
                         :key="todo.id" 
                         class="todo-item-cell"
                         :class="{ 'completed': todo.done }"
                         :style="{ height: `${getEventDurationInHours(todo) * 60 - 4}px` }"
                         @click="toggleTodo(todo.id)">
                        <div class="todo-time">{{ todo.startTime }} - {{ todo.endTime }}</div>
                        <div class="todo-name">{{ todo.name }}</div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
    .calendar-container {
        background-color: #f5f7fa;
    }

    .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        background-color: #fff;
        border-bottom: 1px solid #ebeef5;
    }

    .calendar-nav {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .month-year {
        margin: 0;
        font-size: 18px;
    }

    .week-view {
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .days-header {
        display: flex;
        border-bottom: 1px solid #ebeef5;
        background-color: #fff;
        width: 100%;
    }

    .time-column {
        width: 60px;
        flex-shrink: 0;
    }

    .day-column-header {
        flex: 1;
        min-width: 0;
        text-align: center;
        padding: 10px;
        cursor: pointer;
        border-left: 1px solid #ebeef5;
    }

    .day-name {
        font-size: 12px;
        color: #909399;
    }

    .day-number {
        font-size: 18px;
        font-weight: 500;
        margin-top: 4px;
    }

    .current-day {
        display: inline-block;
        width: 30px;
        height: 30px;
        line-height: 30px;
        border-radius: 50%;
        background-color: #0c83fa;
        color: white;
    }

    .day-column-header.today, .day-column.today {
        background-color: #f0f9ff !important;
    }

    .day-column-header.selected, .day-column.selected {
        background-color: #ecf5ff !important;
    }

    .time-grid {
        display: flex;
        overflow-y: auto;
        flex: 1;
        background-color: #fff;
    }

    .time-labels {
        width: 60px;
        flex-shrink: 0;
        background-color: #fff;
    }

    .time-label {
        height: 60px;
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        padding-right: 8px;
        font-size: 12px;
        color: #909399;
        border-bottom: 1px solid #ebeef5;
    }

    .day-columns {
        display: flex;
        flex: 1;
        width: 100%;
    }

    .day-column {
        flex: 1;
        min-width: 0;
        border-left: 1px solid #ebeef5;
        background-color: inherit;
    }

    .time-cell {
        height: 60px;
        border-bottom: 1px solid #ebeef5;
        position: relative;
        cursor: pointer;
        &:hover{
            background-color: #bedefd;
        }
    }

    // Todo item styling
    .todo-item-cell {
        position: absolute;
        inset: 0;
        
        padding: 4px 6px;
        background-color: #409eff;
        color: white;
        border-radius: 4px;
        font-size: 12px;
        overflow: hidden;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        z-index: 10;
        
        &.completed {
            background-color: #67c23a;
            text-decoration: line-through;
            opacity: 0.8;
        }
        
        &:hover {
            filter: brightness(1.1);
            z-index: 20;
        }
        
        .todo-time {
            font-size: 0.75rem;
            opacity: 0.9;
            margin-bottom: 2px;
        }
        
        .todo-name {
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            font-size: 1rem;
            text-overflow: ellipsis;
        }
    }
</style>