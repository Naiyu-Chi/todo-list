<script setup>
    import { Edit, Delete } from '@element-plus/icons-vue';
    import { ElPopconfirm } from 'element-plus';
    import { defineProps } from 'vue';
    const props = defineProps({
        date: String, 
        items: Object,
        deleteTodo: Function,  
        editTodo: Function,    
        toggleDone: Function
    });
</script>

<template>
    <h2>{{ date }}</h2>
    <!-- 顯示待完成事項 -->
    <h3>待完成事項</h3>
    <ul>
        <li v-for="todo in items.notDone" :key="todo.id">
            <div class="todo-items">
                <span class="todo-item" :style="{ textDecoration: todo.done ? 'line-through' : 'none' }" @click="toggleDone(todo)">
                    {{ todo.name }}
                </span>
                <Edit class="edit-icon" @click="editTodo(todo)" color="#409efc" />
                <el-popconfirm
                    title="確認刪除該項目?"
                    @confirm="deleteTodo(todo)"
                >
                    <template #reference>
                        <Delete class="edit-icon" color="#f56c6c"/>
                    </template>
                </el-popconfirm>
            </div>
        </li>
        <span v-show="items.notDone == 0" class="disabled">無待完成事項</span>
    </ul>

    <!-- 顯示已完成事項 -->
    <h3>已完成事項</h3>
    <ul>
        <li v-for="todo in items.done" :key="todo.id">
            <div class="todo-items">
            <span class="todo-item" :style="{ textDecoration: todo.done ? 'line-through' : 'none' }" @click="toggleDone(todo)">
                {{ todo.name }}
            </span>
            <Edit class="edit-icon" @click="editTodo(todo)" color="#409efc" />
            <el-popconfirm
                title="確認刪除該項目?"
                @confirm="deleteTodo(todo)"
            >
                <template #reference>
                    <Delete class="edit-icon" color="#f56c6c"/>
                </template>
            </el-popconfirm>
            </div>
        </li>
        <span v-show="items.done == 0" class="disabled">無已完成事項</span>
    </ul>
</template>


<style scoped>
    ul li{
        list-style: none;
        margin: 1ch 0;
    }
    .todo-items{
        display: flex;
        align-items: center;
        gap:1rem
    }

    .todo-item{
        cursor: pointer;
        user-select: none; 
    }

    .edit-icon{
        width: 20px;
        height: 20px;
        cursor: pointer;
        margin-top: -5px;
    }

    .disabled{
      color:#a9a8a8;
      font-style: italic;
    }
</style>