<script setup>
  // Hooks
  import { ElMessage } from 'element-plus';
  import useTodo from '@/hooks/useTodo.ts';
  import useDialog from '@/hooks/useDialog.ts';
  // Components
  import TodoHeader from '@/components/Todo/TodoHeader.vue';
  import CardList from '@/components/Todo/CardList.vue';
  import TodoDialog from '@/components/Todo/TodoDialog.vue';

  // Custom Hooks
  const { 
    searchKeyword,
    addTodo, 
    updateTodo, 
    deleteTodo,  
    toggleDone, 
    filteredTodosByDate 
  } = useTodo();

  const {
    dialogFormVisible,
    isEditing,
    dialogTitle,
    selectedId,
    form,
    openDialogForAdd,
    openDialogForEdit,
    closeDialog,
    getFormData
  } = useDialog();

  /**
   * 處理表單提交
   */
  function confirmEdit() {
    const formData = getFormData();
    let success = false;
    
    if (isEditing.value) {
      if (!selectedId.value) {
        ElMessage.error('找不到要更新的項目');
        return;
      }
      success = updateTodo(selectedId.value, formData);
    } else {
      success = addTodo(formData);
    }
    
    if (success) {
      closeDialog();
    }
  }
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
        :openDialogForEdit="openDialogForEdit"
        :toggleDone="toggleDone"/>
        
      <TodoDialog 
        v-model:visible="dialogFormVisible"
        :title="dialogTitle"
        :form="form"
        :isEditing="isEditing"
        @cancel="closeDialog"
        @confirm="confirmEdit"
      />
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