<script setup>
    import { ref, computed } from 'vue';
    import TodoItem from '@/views/todo/components/TodoItem.vue';
    import { useTodoStore } from '@/stores/modules/todo';
    
    const todoStore = useTodoStore();

    // Props
    const props = defineProps({
        // organizedTodos: Object,
        weekDays: Array,
        timePeriods: Array,
        currentMonthYear: String,
        selectedDate: String,
    });
    const isWeek = ref(true);

    // 對話框相關
    const moreDialogVisible = ref(false);
    const moreDialogEvents = ref([]);
    const moreDialogTitle = ref('');

    // 設置最大顯示事項數量
    const MAX_VISIBLE_POSITIONS = 10;

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
     * 獲取特定時間點的事件組
     * @param {string} date - 日期
     * @param {string} timeSlot - 時間區段起始時間
     * @return {Array} - 事件組列表
     */
    function getTimeRangeGroups(date, timeSlot) {
      return todoStore.getGroupsAtTime(date, timeSlot);
    }

    /**
     * 獲取可見的事件組（前10個位置）
     * @param {string} date - 日期
     * @param {string} timeSlot - 時間槽
     * @returns {Array} - 可見的事件組
     */
    function getVisibleGroups(date, timeSlot) {
        const groups = getTimeRangeGroups(date, timeSlot);
        
        // 篩選出位置索引小於10的事件組
        return groups.filter(group => group.position < MAX_VISIBLE_POSITIONS);
    }

    /**
     * 獲取隱藏的事件組（位置索引>=10的事件組）
     * @param {string} date - 日期
     * @param {string} timeSlot - 時間槽
     * @returns {Array} - 隱藏的事件組
     */
    function getHiddenGroups(date, timeSlot) {
        const groups = getTimeRangeGroups(date, timeSlot);
        
        // 篩選出位置索引>=10的事件組
        return groups.filter(group => group.position >= MAX_VISIBLE_POSITIONS);
    }

    /**
     * 獲取所有隱藏事件的數量
     * @param {string} date - 日期
     * @param {string} timeSlot - 時間槽
     * @returns {number} - 隱藏事件數量
     */
    function getHiddenEventCount(date, timeSlot) {
        const hiddenGroups = getHiddenGroups(date, timeSlot);
        
        // 計算所有隱藏組中的事件總數
        return hiddenGroups.reduce((count, group) => {
            return count + (group.events?.length || 0);
        }, 0);
    }

    /**
     * 判斷是否需要顯示更多按鈕
     * @param {string} date - 日期
     * @param {string} timeSlot - 時間槽
     * @returns {boolean} - 是否需要顯示更多按鈕
     */
    function shouldShowMoreButton(date, timeSlot) {
        const groups = getTimeRangeGroups(date, timeSlot);
        
        // 檢查是否有位置索引>=10的事件組
        return groups.some(group => group.position >= MAX_VISIBLE_POSITIONS);
    }

    /**
     * 處理單元格點擊事件，直接觸發新增任務
     * @param {string} date - 日期
     * @param {string} time - 時間
     */
    function handleCellClick(date, time) {
      handleAddTask(date, time);
    }

    /**
     * 顯示更多事件的對話框
     * @param {string} date - 日期
     * @param {string} time - 時間
     */
    function showMoreEventsDialog(date, time) {
        const formattedDate = new Date(date).toLocaleDateString('zh-TW', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            weekday: 'long' 
        });
        moreDialogTitle.value = `${formattedDate} ${time} - 隱藏事項`;
        
        // 獲取所有隱藏的事件
        const hiddenEvents = getHiddenGroups(date, time).flatMap(group => group.events || []);
        moreDialogEvents.value = hiddenEvents;
        moreDialogVisible.value = true;
    }

    /**
     * 關閉更多事件的對話框
     */
    function closeMoreDialog() {
        moreDialogVisible.value = false;
        moreDialogEvents.value = [];
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
              <div class="cell-content">
                <!-- 顯示位置索引小於10的事項 -->
                <TodoItem
                  v-for="group in getVisibleGroups(day.formattedDate, time)"
                  :key="`event-${day.formattedDate}-${time}-${group.events[0].id}`"
                  :group="group"
                  :position="group.position"
                  :total="group.total"
                  @edit="handleEdit"
                />
                
                <!-- 如果有位置索引>=10的事項，顯示 +x 按鈕 -->
                <button
                  v-if="shouldShowMoreButton(day.formattedDate, time)"
                  class="more-events-button"
                  @click.stop="showMoreEventsDialog(day.formattedDate, time)"
                >
                  +{{ getHiddenEventCount(day.formattedDate, time) }}
                </button>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>

    <!-- 更多事項對話框 -->
    <el-dialog
      v-model="moreDialogVisible"
      :title="moreDialogTitle"
      width="350px"
      append-to-body
    >
      <div class="more-events-list">
        <div
          v-for="event in moreDialogEvents"
          :key="event.id"
          class="more-event-item"
          :class="{ 'event-completed': event.done }"
          @click="handleEdit(event); closeMoreDialog();"
        >
          <div class="event-checkbox" @click.stop>
            <el-checkbox
              v-model="event.done"
              @change="todoStore.toggleDone(event.id)"
            ></el-checkbox>
          </div>
          <div class="event-details">
            <div class="event-time">{{ event.startTime }} - {{ event.endTime }}</div>
            <div class="event-name">{{ event.name }}</div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeMoreDialog">關閉</el-button>
        </span>
      </template>
    </el-dialog>
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
        
        .cell-content {
            position: relative;
            width: 100%;
            height: 100%;
        }
    }

    .day-column-header.today, .time-cell.today {
        background-color: #f0f9ff;
    }

    .day-column-header.selected, .time-cell.selected {
      background-color: #ecf5ff;
    }

    /* 顯示更多按鈕樣式 */
    .more-events-button {
        position: absolute;
        right: 5px;
        bottom: 5px;
        background-color: #409eff;
        color: white;
        border: none;
        border-radius: 12px;
        padding: 2px 8px;
        font-size: 12px;
        cursor: pointer;
        z-index: 100;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        
        &:hover {
            background-color: #66b1ff;
        }
    }

    /* 更多事項對話框中的列表樣式 */
    .more-events-list {
        max-height: 350px;
        overflow-y: auto;
    }

    .more-event-item {
        display: flex;
        padding: 10px;
        border-bottom: 1px solid #ebeef5;
        cursor: pointer;
        
        &:hover {
            background-color: #f5f7fa;
        }
        
        &.event-completed {
            text-decoration: line-through;
            color: #67c23a;
        }
        
        .event-checkbox {
            margin-right: 10px;
        }
        
        .event-details {
            flex: 1;
            
            .event-time {
                font-size: 12px;
                color: #909399;
            }
            
            .event-name {
                font-size: 14px;
                font-weight: 500;
                margin-top: 2px;
            }
        }
    }
</style>