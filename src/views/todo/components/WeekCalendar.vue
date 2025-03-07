<script setup>
    import { ref } from 'vue';
    import TodoItem from '@/views/todo/components/TodoItem.vue';
    import { useTodoStore } from '@/stores/modules/todo';
    const todoStore = useTodoStore();

    // Props
    const props = defineProps({
        organizedTodos: Object,
        weekDays: Array,
        timePeriods: Array,
        currentMonthYear: String,
        selectedDate: String,
    });
    const isWeek = ref(true);

    // Emits
    const emit = defineEmits(['previous-week', 'next-week', 'go-today', 'toggle-add', 'select-date', 'toggle-edit']);

    function handleSelectDate(day) {
        emit('select-date', day.formattedDate); 
    }

    function handleAddTask(date, time) {
        emit('toggle-add', date, time);
    }

    function handleEdit(todo){
        emit('toggle-edit', todo);
    }

    /**
     * 獲取特定時間點的分組
     * @param {string} date - 日期
     * @param {string} timeSlot - 時間區段起始時間
     * @return {Array} - 事件分組
     */
    function getTimeRangeGroups(date, timeSlot) {
      return todoStore.getGroupsAtTime(date, timeSlot);
    }

    /**
     * 處理單元格點擊事件，直接觸發新增任務
     * @param {string} date - 日期
     * @param {string} time - 時間
     */
    function handleCellClick(date, time) {
      handleAddTask(date, time);
    }
</script>

<template>
  <div class="calendar-container">
    <!-- 日曆導航頭部 -->
    <div class="calendar-nav-header">
      <!-- 行事曆導覽項目 -->
        <p class="month-year el-calendar__title">{{ currentMonthYear }}</p>
      <div class="view-actions">
        <slot name="header-actions"></slot>
      </div>
    </div>

    <!-- 日曆滾動容器 -->
    <div class="calendar-scroll-container" v-show="isWeek">
      <div class="calendar-content">
        <!-- 左上角的空白單元格 -->
        <div class="corner-cell"></div>
        <!-- 日期標頭 -->
        <div v-for="day in weekDays" :key="`header-${day.formattedDate}`" 
             class="day-column-header"
             :class="{ 'today': day.isToday, 'selected': day.isSelected || day.formattedDate === selectedDate }"
             @click="handleSelectDate(day)">
          <div class="day-name">{{ day.dayName }}</div>
          <div class="day-number" :class="{ 'current-day': day.isToday }">
            {{ day.dayNumber }}
          </div>
        </div>
        
        <!-- 時間行及單元格 -->
        <template v-for="time in timePeriods" :key="`row-${time}`">
          <!-- 時間標籤 -->
          <div class="time-label">{{ time }}</div>
          <!-- 這個時間行的所有日期單元格 -->
          <template v-for="day in weekDays" :key="`cell-${day.formattedDate}-${time}`">
            <div class="time-cell" 
                 :class="{ 'today': day.isToday, 'selected': day.isSelected || day.formattedDate === selectedDate  }"
                 @click="handleCellClick(day.formattedDate, time)">
              <!-- 渲染事件分組 -->
              <template v-if="getTimeRangeGroups(day.formattedDate, time).length > 0">
                <TodoItem
                  v-for="group in getTimeRangeGroups(day.formattedDate, time)"
                  :key="`group-${day.formattedDate}-${time}-${group.startTime}`"
                  :group="group"
                  :position="group.position"
                  :total="group.total"
                  @edit="handleEdit"
                />
              </template>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
    .calendar-container {
        background-color: #f5f7fa;
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
    }

    .calendar-nav-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        background-color: #fff;
        border-bottom: 1px solid #ebeef5;
        flex-shrink: 0;
    }

    .calendar-nav {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .calendar-scroll-container {
        flex: 1;
        overflow: auto;
        position: relative;
    }

    .calendar-content {
        display: grid;
        grid-template-columns: 60px repeat(7, minmax(200px, 1fr)); 
        overflow-y: hidden;
    }

    /* 左上角空白單元格 */
    .corner-cell {
        position: sticky;
        top: 0;
        left: 0;
        z-index: 3;
        background-color: #fff;
        border-bottom: 1px solid #ebeef5;
        height: 64px;
    }

    /* 日期標頭 */
    .day-column-header {
        position: sticky;
        top: 0;
        z-index: 2;
        text-align: center;
        padding: 8px;
        cursor: pointer;
        border-left: 1px solid #ebeef5;
        border-bottom: 1px solid #ebeef5;
        background-color: #fff;
        height: 48px;
    }

    .day-name {
        font-size: 16px;
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

    .time-label {
        position: sticky;
        left: 0;
        z-index: 99;
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        padding-right: 8px;
        font-size: 14px;
        color: #909399;
        border-bottom: 1px solid #ebeef5;
        background-color: #fff;
        height: 80px;
    }

    .time-cell {
        height: 80px;
        border-bottom: 1px solid #ebeef5;
        border-left: 1px solid #ebeef5;
        position: relative;
        cursor: pointer;
        &:hover:not(:has(*:hover)){
            background-color: #bedefd;
        }
    }

    .day-column-header.today, .time-cell.today {
        background-color: #f0f9ff;
    }

    .day-column-header.selected, .time-cell.selected {
      background-color: #ecf5ff;
    }
</style>