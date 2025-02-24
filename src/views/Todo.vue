<template>
    <h1>代辦事項清單列表</h1>
    <ul>
        <div v-for="(items, date) in todosByDate" :key="date" class="todo-list">
            <h2>{{ date }}</h2>

            <!-- 顯示待完成事項 -->
            <h3>待完成事項</h3>
            <ul>
                <li v-for="todo in items.notDone" :key="todo.id">
                    <div class="todo-items">
                        <span class="todo-item" :style="{ textDecoration: todo.done ? 'line-through' : 'none' }" @click="toggleDone(todo)">
                            {{ todo.name }}
                        </span>
                        <Edit class="edit-icon" @click="editTodo(todo)" />
                        <el-popconfirm
                            title="Are you sure to delete this todo?"
                            @confirm="deleteTodo(todo)"
                        >
                            <template #reference>
                            <Delete class="edit-icon" />
                            </template>
                        </el-popconfirm>
                    </div>
                </li>
                <span v-show="items.notDone == 0">無待完成事項</span>
            </ul>

            <!-- 顯示已完成事項 -->
            <h3>已完成事項</h3>
            <ul>
                <li v-for="todo in items.done" :key="todo.id">
                    <div class="todo-items">
                    <span class="todo-item" :style="{ textDecoration: todo.done ? 'line-through' : 'none' }" @click="toggleDone(todo)">
                        {{ todo.name }}
                    </span>
                    <Edit class="edit-icon" @click="editTodo(todo)" />
                    <el-popconfirm
                        title="Are you sure to delete this todo?"
                        @confirm="deleteTodo(todo)"
                    >
                        <template #reference>
                        <Delete class="edit-icon" />
                        </template>
                    </el-popconfirm>
                    </div>
                </li>
                <span v-show="items.done == 0">無已完成事項</span>
            </ul>
        </div>
    </ul>
  
    <!-- Add/Edit Dialog -->
    <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="500">
      <el-form :model="form">
        <el-form-item label="代辦事項名稱">
          <el-input v-model="form.name" placeholder="請輸入代辦事項名稱"></el-input>
        </el-form-item>
        <el-form-item label="預計完成日期">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="預計完成日期"
          />
        </el-form-item>
      </el-form>
  
      <!-- Dialog Footer -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelEdit">取消</el-button>
          <el-button type="primary" @click="confirmEdit">確認</el-button>
        </div>
      </template>
    </el-dialog>
  
    <el-button @click="openDialogForAdd">新增</el-button>
  </template>

<script setup>
    /** 須完成項目
     * 1. 新增代辦事項
     * 2. 修改代辦事項
     * 3. 刪除代辦事項
     * 4. 代辦事項標記完成
     * 5. 代辦事項排序 (日期時間)
     * 6. 代辦事項搜尋
     * 7. 修正選擇日期bug
     */ 
  import { ref, reactive, computed } from 'vue';
  import { Edit, Delete } from '@element-plus/icons-vue';
  import {
    ElButton,
    ElDialog,
    ElMessage,
    ElInput,
    ElDatePicker,
    ElForm,
    ElFormItem,
    ElPopconfirm,
  } from 'element-plus';

  // Reactive variables
  const dialogFormVisible = ref(false);
  const isEditing = ref(false);
  const dialogTitle = ref('');
  const selectedId = ref('');
  const form = reactive({
    name: '',
    date: null, 
  });

  // Initial Fake Data
  const todos = reactive([
    { id: 1, name: 'Learn Vue 2', done: true, date: new Date('2015/02/26') },
    { id: 4, name: 'Learn Vue 3', done: false, date: new Date('2015/02/26') },
    { id: 2, name: 'Learn React', done: false, date: new Date('2015/02/27') },
    { id: 3, name: 'Build something awesome', done: false, date: new Date('2015/02/28') },
  ]);

  // Methods
  function openDialogForAdd() {
    dialogTitle.value = '新增代辦事項';
    selectedId.value = '';
    form.name = '';
    form.date = null;
    isEditing.value = false;
    dialogFormVisible.value = true;
  }

  function closeDialog() {
    dialogFormVisible.value = false;
    form.name = '';
    form.date = null;
  }

  function cancelEdit() {
    closeDialog();
  }

  function confirmEdit() {
    if (isEditing.value) {
      updateTodo();
    } else {
      addTodo();
    }
  }

  /**
   * 標記代辦事項為完成/未完成
   * @param todo 
   */
  function toggleDone(todo){
    const index = todos.findIndex((t) => t.id === todo.id);
    if (index !== -1) {
      todos[index].done = !todos[index].done;
    }
  }

  /**
   * 新增代辦項目至清單
   */
  function addTodo() {
    if (!form.name || !form.date) {
      ElMessage({
        showClose: true,
        message: '請輸入代辦事項名稱和日期',
        type: 'warning',
      });
      return;
    }

    const newTodo = {
      id: crypto.randomUUID(),
      name: form.name,
      date: form.date,
      done: false,
    };

    todos.push(newTodo);
    closeDialog();
  }

  /**
   * 開啟編輯代辦事項對話框
   * @param todo 
   */
  function editTodo(todo) {
    selectedId.value = todo.id;
    isEditing.value = true;
    dialogTitle.value = '編輯代辦事項';
    form.name = todo.name;
    form.date = todo.date;
    dialogFormVisible.value = true;
  }

  /**
   * 更新代辦事項
   */
  function updateTodo() {
    const index = todos.findIndex((todo) => todo.id === selectedId.value);
    if (index !== -1) {
      todos[index].name = form.name;
      todos[index].date = form.date;
    }
    closeDialog();
  }

  /**
   * 刪除代辦事項
   * @param todo 
   */
  function deleteTodo(todo) {
    const index = todos.findIndex((t) => t.id === todo.id);
    if (index !== -1) {
      todos.splice(index, 1);
    }
  }

    const todosByDate = computed(() => {
        const grouped = {};

        todos.forEach(todo => {
            const dateKey = todo.date.toISOString().split('T')[0]; // 取日期部分 (YYYY-MM-DD)
            
            if (!grouped[dateKey]) {
            grouped[dateKey] = {
                done: [],
                notDone: []
            };
            }

            // 根據 done 狀態將 todo 分配到相應的陣列
            if (todo.done) {
                grouped[dateKey].done.push(todo);
            } else {
                grouped[dateKey].notDone.push(todo);
            }
        });

        return grouped;
    });
  
</script>

<style scoped>
    .todo-list{
        border: 2px solid var(--el-border-color);
        width: fit-content;
        margin: 1rem 0;
        min-height: 25vh;
        padding: 1rem;
        border-radius: 8px;
        min-width: 400px;
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

    ul li{
        list-style: none;
        margin: 1ch 0;
    }
</style>