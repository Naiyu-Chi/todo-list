<template>
    <div 
        :class="['todo-item-cell', { 'completed': todo.done }]"
        :style="{ 
            '--event-duration': getEventDurationInHours(),
            '--start-offset': `${getStartTimeOffset()}%` 
        }"
        @click.stop="handleEdit(todo)">
        <div class="todo-time">{{ todo.startTime }} - {{ todo.endTime }}</div>
        <div class="todo-name">{{ todo.name }}</div>
    </div>
</template>
  
<script setup>
    const props = defineProps({
        todo: {
            type: Object,
            required: true
        }
    });
    
    const emit = defineEmits(['edit']);
    
    //計算項目時長
    function getEventDurationInHours() {
        if (!props.todo.startTime || !props.todo.endTime) return 1;
        
        const [startHour, startMinute] = props.todo.startTime.split(':').map(Number);
        const [endHour, endMinute] = props.todo.endTime.split(':').map(Number);
        
        const startTotalMinutes = startHour * 60 + startMinute;
        const endTotalMinutes = endHour * 60 + endMinute;
        
        return (endTotalMinutes - startTotalMinutes) / 60;
    }

    //計算初始時間偏移
    function getStartTimeOffset() {
        if (!props.todo.startTime) return 0;
        
        const [_, startMinute] = props.todo.startTime.split(':').map(Number); //e.g. Map "9:30" to [9,30]
        
        return (startMinute / 60) * 100;
    }
    
    function handleEdit(todo) {
        emit('edit', todo);
    }

    // import { useTodoStore } from '@/stores/modules/todo';
    // const todoStore = useTodoStore();
</script>
  
<style lang="scss" scoped>
    .todo-item-cell {
        position: absolute;
        inset: 0;
        top:var(--start-offset);
        height: calc(var(--event-duration) * 100% - 8px) ;
        padding: 4px 6px;
        background-color: #409eff;
        color: white;
        border-radius: 4px;
        font-size: 12px;
        overflow: hidden;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        z-index: 10;
        pointer-events: auto;
        
        &.completed {
            background-color: #67c23a;
            text-decoration: line-through;
        }
        
        &:hover {
            filter: brightness(1.1);
            z-index: 20;
        }
        
        .todo-time {
            font-size: 0.75rem;
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