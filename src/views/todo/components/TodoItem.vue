<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { useTodoStore } from '@/stores/modules/todo';
    import useTimeCalculations from '@/hooks/useTimeCalculation';
    import useDialog from '@/hooks/useDialog';
    
    const { getEventDurationInHours, getStartTimeOffset } = useTimeCalculations();
    const todoStore = useTodoStore();
    const { openDialogForEdit } = useDialog();

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


    const emit = defineEmits(['edit']);

    const isGroup = computed(() => props.group !== null);

    const currentTodo = computed(() => isGroup.value ? props.group.events[0] : props.todo);

    /**
     * 計算事件持續時間（小時）
     */
    const duration = computed(() => {
        return getEventDurationInHours(currentTodo.value.startTime, currentTodo.value.endTime);
    });

    // 計算高度垂直偏移
    const startOffset = computed(() => {
        return getStartTimeOffset(currentTodo.value.startTime);
    });

    /**
     * 計算項目寬度，右邊預留空間新增項目
     * @returns {string} CSS 寬度值
     */
    function getItemWidth() {
        const propsTotal = props.total > 10 ? 10 : props.total;
        const widthPercentage = 85 / propsTotal;
        return `${widthPercentage}%`;
    }

    /**
     * 計算水平偏移位置
     * @returns {string} CSS 偏移值
     */
    function getHorizontalOffset() {
        if (props.total <= 1) return '0%';
        const propsTotal = props.total > 10 ? 10 : props.total;
        const singleWidth = 85 / propsTotal;
        const offset = props.position * singleWidth;
        return `${offset}%`;
    }

    /**
     * 計算z-index值，設定右側項目有較高的index
     * @returns {number} z-index值
     */
    function getZIndex() {
        return 10 + props.position;
    }

    // 處理待辦事項點擊事件
    function handleItemClick() {
        openDialogForEdit(currentTodo.value);
    }

    const supportsHover = ref(false);

    onMounted(() => {
        supportsHover.value = window.matchMedia('(hover: hover)').matches;
        
        const mediaQuery = window.matchMedia('(hover: hover)');
            mediaQuery.addEventListener('change', (e) => {
            supportsHover.value = e.matches;
        });

        console.log(props.group)
    });
</script>

<template>
    <el-tooltip 
        placement="top" 
        :disabled="!supportsHover" 
        :enterable="false"
        :show-after="0"
        :hide-after="0">
        <template #content>
            <span>任務時間 : {{ currentTodo.startTime }} - {{ currentTodo.endTime }}</span><br>
            <span>任務名稱 :{{ currentTodo.name }}</span>
        </template>
        <div 
            class="todo-item-cell"
            :class="{ 'completed': currentTodo.done }"
            :style="{ 
                '--event-duration': duration,
                '--start-offset': `${startOffset}%`,
                'width': getItemWidth(),
                'left': getHorizontalOffset(),
                'z-index': getZIndex()
            }"
            @click.stop="handleItemClick">
            <!-- 待辦事項內容 -->
            <div class="todo-content">
                <div class="todo-time">
                    {{ currentTodo.startTime }} - {{ currentTodo.endTime }}
                </div>
                <div class="todo-name">{{ currentTodo.name }}</div>
            </div>
        </div>
    </el-tooltip>

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
        pointer-events: auto;
        transition: all 0.2s ease-in-out;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        border:2px solid white;
        
        &.completed {
            background-color: #67c23a;
            text-decoration: line-through;
        }
        
        /* 滑鼠懸停效果 */
        &:hover {
            filter: brightness(1.1);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            transform: translateY(-1px);
        }
        
        .todo-time {
            font-size: 0.75rem;
            margin-bottom: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            opacity: 0.9;
        }
        
        .todo-name {
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            font-size: 0.9rem;
            text-overflow: ellipsis;
        }
    }
</style>