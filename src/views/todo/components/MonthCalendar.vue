<script setup>
    import { ref } from 'vue'
    import { useTodoStore } from '@/stores/modules/todo'
    import moment from 'moment'

    const emit = defineEmits(['select-date', 'toggle-calendar'])
    const value = ref(new Date())
    const todoStore = useTodoStore()

    const formatDate = (date) => moment(date).format('YYYY-MM-DD')

    function getTodosForDate(dateString) {
        return todoStore.getTodosByDate(dateString) || []
    }

    function getCompletedTodosForDate(dateString) {
        const dateTodos = getTodosForDate(dateString)
        return dateTodos.filter(todo => todo.done)
    }

    function getIncompleteTodosForDate(dateString) {
        const dateTodos = getTodosForDate(dateString)
        return dateTodos.filter(todo => !todo.done)
    }

    function handleSelectDate(date) {
        emit('toggle-calendar', date)
    }
</script>

<template>
  <div class="month-calendar-container">
    <el-calendar v-model="value">
      <template #date-cell="{ data }">
        <!-- 日期容器 -->
        <div 
          class="date-cell-content"
          @click="handleSelectDate(data.date)"
        >
          <!-- 日期數字 -->
          <div 
            class="date-number" 
            :class="{ 
              'is-selected': data.isSelected,
              'is-today': data.isToday, 
              'has-events': getTodosForDate(formatDate(data.date)).length > 0
            }"
          >
            {{ data.day }}
          </div>
          <!--  -->
          <div 
            v-if="getTodosForDate(formatDate(data.date)).length > 0" 
            class="todo-stats"
          >
            <!-- 未完成項目 -->
            <div 
              v-if="getIncompleteTodosForDate(formatDate(data.date)).length > 0" 
              class="todo-stat-item incomplete"
            >
              <span class="status-dot"></span>
              <span class="status-text">未完成: {{ getIncompleteTodosForDate(formatDate(data.date)).length }}</span>
            </div>
            
            <!-- 完成項目 -->
            <div 
              v-if="getCompletedTodosForDate(formatDate(data.date)).length > 0" 
              class="todo-stat-item completed"
            >
              <span class="status-dot"></span>
              <span class="status-text">已完成: {{ getCompletedTodosForDate(formatDate(data.date)).length }}</span>
            </div>
          </div>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<style lang="scss" scoped>
    .month-calendar-container {
        margin-top: 20px;
        :deep(.el-calendar-day) {
            min-height: 12vh;
            text-align: center;
            padding: 0;
        }
        :deep(.el-calendar-table tr td) {
            border: 1px solid #ebeef5;
        }
        
        .date-cell-content {
            width: 100%;
            height: 100%;
            padding: 6px;
            cursor: pointer;
            display: flex;
            flex-direction: column;
        }
        
        .date-number {
            padding: 4px 8px;
            margin-bottom: 8px;
            display: inline-block;
            font-weight: 500;
            text-align: center;
            border-radius: 50%;
            font-size: 14px;
            &.is-weekend {
                color: #f56c6c;
            }
            &.is-today {
                background-color: #409eff;
                color: white;
            }
        }
        .todo-stats {
            margin-top: 4px;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .todo-stat-item {
            display: flex;
            align-items: center;
            font-size: 12px;
            &.incomplete {
                .status-dot {
                    background-color: #409eff;
                }
                .status-text {
                    color: #409eff;
                }
            }
            &.completed {
                .status-dot {
                    background-color: #67c23a;
                }
                .status-text {
                    color: #67c23a;
                }
            }
            .status-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                margin-right: 6px;
            }
            .status-text {
                font-size: 12px;
            }
        }
    }
</style>