<script setup>
    import { ref, computed } from 'vue';
    import { useTodoStore } from '@/stores/modules/todo';
    import useTimeCalculations from '@/hooks/useTimeCalculation';
    const { getStartTimeOffset, getEventDurationInHours } = useTimeCalculations();
    import useDialog from '@/hooks/useDialog';
    const todoStore = useTodoStore();
    const { openDialogForEdit } = useDialog()

    const props = defineProps({
        todo: Object,
        group: Object,
        position: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            default: 1
        }
    });

    const emit = defineEmits(['edit', 'toggleGroup']);

    // 對話框可見性
    const groupDialogVisible = ref(false);

    /**
     * 判斷是否為群組
     */
    const isGroup = computed(() => props.group !== null);

    /**
     * 獲取群組中的所有事件
     */
    const groupEvents = computed(() => isGroup.value ? props.group.events : []);

    /**
     * 獲取第一個待辦事項
     */
    const firstTodo = computed(() => isGroup.value ? props.group.events[0] : props.todo);
    const duration = computed(() => getEventDurationInHours(firstTodo.value.startTime, firstTodo.value.endTime));

    /**
     * 檢查群組內所有事項是否都已完成
     */
    const allGroupItemsCompleted = computed(() => {
        if (!isGroup.value) return false;
        if (groupEvents.value.length === 0) return false;
        return groupEvents.value.every(item => item.done);
    });

    /**
     * 根據總分組數計算項目寬度
     * @returns {string} CSS 寬度值
     */
    function getItemWidth() {
        // 每個時間範圍分組的寬度，預留空間添加更多項目
        return `${80 / props.total}%`;
    }

    /**
     * 計算水平偏移位置
     * @returns {string} CSS 偏移值
     */
    function getHorizontalOffset() {
        if (props.total <= 1) return '0';
        
        // 計算此分組的位置
        const singleWidth = 80 / props.total;
        return `${props.position * singleWidth}%`;
    }

    /**
     * 處理待辦事項點擊
     * @param {Object} todo - 待辦事項
     */
    function handleEdit(todo) {
        console.log("todo..........")
        emit('edit', todo);
        closeGroupDialog();
    }

    /**
     * 處理分組點擊
     */
    function handleGroupClick() {
        if (isGroup.value && groupEvents.value.length > 1) {
            groupDialogVisible.value = true;
        } else {
            // 如果只有一個項目，直接編輯
            console.log(firstTodo.value)
            // emit('edit', firstTodo.value);
            openDialogForEdit(firstTodo.value);
        }
    }

    /**
     * 關閉分組對話框
     */
    function closeGroupDialog() {
        groupDialogVisible.value = false;
    }
</script>

<template>
    <div 
        :class="[
            'todo-item-cell', 
            { 
                'completed': !isGroup ? todo.done : allGroupItemsCompleted,
                'todo-group': isGroup,
                'multiple-items': isGroup && group.events.length > 1
            }
        ]"
        :style="{ 
            '--event-duration': duration,
            '--start-offset': `${getStartTimeOffset()}%`,
            'width': getItemWidth(),
            'left': getHorizontalOffset(),
        }"
        @click.stop="handleGroupClick">
        <!-- 單個待辦事項或分組中的第一個待辦事項 -->
        <div class="todo-content">
            <div class="todo-time">
                {{ firstTodo.startTime }} - {{ firstTodo.endTime }}
            </div>
            <div class="todo-name">{{ firstTodo.name }}</div>
            
            <!-- 分組中的更多項目指示器 -->
            <div v-if="isGroup && group.events.length > 1" class="more-badge">
                +{{ group.events.length - 1 }} 個更多
            </div>
        </div>
        
        <!-- 分組對話框 -->
        <el-dialog
            v-model="groupDialogVisible"
            :title="`${firstTodo.startTime} - ${firstTodo.endTime} 待辦事項`"
            width="300px"
            append-to-body
        >
        <div class="group-items-list">
            <div 
                v-for="(item) in groupEvents" 
                :key="item.id"
                class="group-item"
                :class="{ 'completed': item.done }"
                @click="handleEdit(item)"
            >
                <div class="item-checkbox" @click.stop>
                    <el-checkbox 
                        v-model="item.done" 
                        @change="todoStore.toggleDone(item.id)"
                    ></el-checkbox>
                </div>
                <div class="item-name">{{ item.name }}</div>
                <div class="item-status" v-if="item.done">✓</div>
            </div>
        </div>
        </el-dialog>
    </div>
</template>

<style lang="scss" scoped>
    .todo-item-cell {
        position: absolute;
        top: var(--start-offset);
        height: calc(var(--event-duration) * 100% - 8px);
        padding: 4px 6px;
        background-color: #409eff;
        color: white;
        border-radius: 4px;
        font-size: 12px;
        overflow: hidden;
        cursor: pointer;
        z-index: 10;
        pointer-events: auto;
        transition: all 0.2s ease-in-out;
        border:1px solid #fff;
        
        &.completed {
            background-color: #67c23a;
            text-decoration: line-through;
        }
        
        &.todo-group {
            background-color: #409eff;
            
            &.multiple-items {
                .more-badge {
                    display: inline-block;
                    background-color: rgba(0, 0, 0, 0.2);
                    border-radius: 12px;
                    padding: 2px 6px;
                    font-size: 10px;
                    margin-top: 2px;
                }
            }
            
            &.completed {
                background-color: #67c23a;
                
                .more-badge {
                    background-color: rgba(0, 0, 0, 0.15);
                }
            }
        }
        
        &:hover {
            filter: brightness(1.1);
            z-index: 20;
        }
        
        .todo-time {
            font-size: 0.75rem;
            margin-bottom: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .todo-name {
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            font-size: 1rem;
            text-overflow: ellipsis;
        }
    }

    .group-items-list {
        max-height: 300px;
        overflow-y: auto;
        
        .group-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            margin-bottom: 4px;
            background-color: #f5f7fa;
            border-radius: 4px;
            cursor: pointer;
            
            &:hover {
                background-color: #ecf5ff;
            }
            
            &.completed {
                text-decoration: line-through;
                color: #67c23a;
            }
            
            .item-name {
                flex: 1;
            }
            
            .item-status {
                margin-left: 8px;
                color: #67c23a;
            }
        }
    }

    .item-checkbox {
            margin-right: 12px;
            display: flex;
            align-items: center;
        }
</style>