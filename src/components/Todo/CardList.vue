<script setup>
    import CardItem from './CardItem.vue';
    const props = defineProps({
        filteredTodosByDate: {
            type: Object,
            required: true
        }, 
        deleteTodo: Function,  
        editTodo: Function,    
        toggleDone: Function
    });
</script>

<template>
    <div class="todo-container">
        <div v-for="(items, date) in filteredTodosByDate" :key="date" class="todo-list">
            <CardItem 
              :date="date.toString()" 
              :items="items"
              :deleteTodo="deleteTodo" 
              :editTodo="editTodo"
              :toggleDone="toggleDone" />
        </div>
        <div v-if="Object.keys(filteredTodosByDate).length === 0" class="empty-state">
          沒有符合條件的待辦事項
      </div>
    </div>
</template>

<style scoped>
    .todo-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
        width: 100%;
        max-width: 1600px;
        margin: 0 auto;
    }
    
    .todo-list {
        border: 2px solid var(--el-border-color);
        margin: 0;
        min-height: 25vh;
        padding: 1rem;
        border-radius: 8px;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
    }
    
    @media (max-width: 768px) {
        .todo-container {
            grid-template-columns: 1fr;
        }
    }
</style>