<script setup>
  import { ref, reactive, computed } from 'vue';
  import {
    ElButton,
    ElDialog,
    ElMessage,
    ElInput,
    ElDatePicker,
    ElForm,
    ElFormItem,
  } from 'element-plus';
  import CardList from '@/components/Todo/CardList.vue';
  import TodoHeader from '@/components/Todo/TodoHeader.vue';

  // Reactive variables
  const dialogFormVisible = ref(false);
  const isEditing = ref(false);
  const searchKeyword = ref('');
  const dialogTitle = ref('');
  const selectedId = ref('');
  const form = reactive({
    name: '',
    date: null, 
  });

  // Initial Fake Data
  const todos = reactive([
    { id: 1, name: 'Learn Vue 2', done: true, date: '2025-02-26' },
    { id: 4, name: 'Learn Vue 3', done: false, date: '2025-02-26' },
    { id: 2, name: 'Learn React', done: false, date: '2025-02-27' },
    { id: 3, name: 'Build something awesome', done: false, date: '2025-02-28' },
  ]);

  // Methods
  function openDialogForAdd() {
    dialogTitle.value = '新增待辦事項';
    isEditing.value = false;
    dialogFormVisible.value = true;
  }

  function closeDialog() {
    dialogFormVisible.value = false;
    form.name = '';
    form.date = null;
    selectedId.value = '';
  }

  function cancelEdit() {
    closeDialog();
  }

  function confirmEdit() {
    isEditing.value ? updateTodo() : addTodo();
  }

   /**
   * 修改任務項目狀態 (完成/未完成)
   * @param {Object} todo - 待辦事項對象
   */
   function toggleDone(todo) {
    const index = findTodoIndex(todo.id);
    if (index !== -1) {
      todos[index].done = !todos[index].done;
    }
  }

  /**
   * 根據ID查找待辦事項的索引
   * @param {string|number} id - 待辦事項ID
   * @returns {number} 索引值或-1(未找到)
   */
   function findTodoIndex(id) {
    return todos.findIndex(todo => todo.id === id);
  }

  /**
   * 驗證表單數據
   * @returns {boolean} 
   */
   function validateForm() {
    if (!form.name || !form.date) {
      ElMessage({
        showClose: true,
        message: '請輸入待辦事項名稱和日期',
        type: 'warning',
      });
      return false;
    }
    return true;
  }

  /**
   * 新增待辦項目至清單
   */
   function addTodo() {
    if (!validateForm()) return;

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
   * 開啟編輯待辦事項對話框
   * @param todo 
   */
  function editTodo(todo) {
    selectedId.value = todo.id;
    isEditing.value = true;
    dialogTitle.value = '編輯待辦事項';
    form.name = todo.name;
    form.date = todo.date;
    dialogFormVisible.value = true;
  }

  /**
   * 更新待辦事項
   */
   function updateTodo() {
    if (!validateForm()) return;
    
    const index = findTodoIndex(selectedId.value);
    if (index !== -1) {
      todos[index].name = form.name;
      todos[index].date = form.date;
    }
    closeDialog();
  }

  /**
   * 刪除待辦事項
   * @param todo 
   */
   function deleteTodo(todo) {
    const index = findTodoIndex(todo.id);
    if (index !== -1) {
      todos.splice(index, 1);
    }
  }

  // Computed
  const todosByDate = computed(() => {
    // 按日期從早到晚排序
    const sortedTodos = [...todos].sort((a, b) => {
      return a.date.localeCompare(b.date);
    });
    
    const grouped = {};

    sortedTodos.forEach(todo => {
      const dateKey = todo.date;
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          done: [],
          notDone: []
        };
      }
      
      if (todo.done) {
        grouped[dateKey].done.push(todo);
      } else {
        grouped[dateKey].notDone.push(todo);
      }
    });
    return grouped;
  });

  // 根據搜尋關鍵字過濾待辦事項，並且照日期排序
  const filteredTodosByDate = computed(() => {
    // 去除空白鍵搜尋
    if (!searchKeyword.value.trim()) {
      return todosByDate.value;
    }

    const filtered = {};
    const keyword = searchKeyword.value.toLowerCase();

    Object.keys(todosByDate.value).forEach(date => {
      const dateGroup = todosByDate.value[date];
      const filteredDone = dateGroup.done.filter(
        todo => todo.name.toLowerCase().includes(keyword)
      );
      const filteredNotDone = dateGroup.notDone.filter(
        todo => todo.name.toLowerCase().includes(keyword)
      );

      // 如果該日期有符合條件的待辦事項，則添加到結果中
      if (filteredDone.length > 0 || filteredNotDone.length > 0) {
        filtered[date] = {
          done: filteredDone,
          notDone: filteredNotDone
        };
      }
    });

    return filtered;
  });
</script>

<template>
  <div class="todo-app">
      <TodoHeader 
        v-model="searchKeyword" 
        :openDialogForAdd="openDialogForAdd" 
      />
      
      <CardList 
        :filteredTodosByDate="filteredTodosByDate" 
        :deleteTodo="deleteTodo" 
        :editTodo="editTodo"
        :toggleDone="toggleDone"/>
    
      <!-- Add/Edit Dialog -->
      <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="450">
        <el-form :model="form">
          <el-form-item label="待辦事項名稱">
            <el-input v-model="form.name" placeholder="請輸入待辦事項名稱"></el-input>
          </el-form-item>
          <el-form-item label="預計完成日期">
            <el-date-picker
              v-model="form.date"
              type="date"
              placeholder="預計完成日期"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
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
  </div>
</template>

<style scoped>
  .todo-app {
      max-width: 1600px;
      margin: 0 auto;
      padding: 1rem;
      min-height: 100vh;
  }
  .empty-state {
      text-align: center;
      margin: 2rem 0;
      color: #909399;
      font-size: 16px;
  }
</style>