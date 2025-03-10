<script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { useTodoStore } from '@/stores/modules/todo';
  import useDialog from '@/hooks/useDialog';
  import { TIME_STEP } from '~/env.d.ts';
  
  const todoStore = useTodoStore();
  const { 
    dialogFormVisible, 
    isEditing, 
    dialogTitle, 
    selectedId, 
    form, 
    closeDialog, 
    validateForm,
    getFormData,
  } = useDialog();

  // 新增待辦事項
  function handleAddTask(){
    const formData = getFormData();
    if(!validateForm()) return;
    todoStore.addTodo(formData).then((success)=>{
      if(success){
        console.log(formData);
        closeDialog();
      }
    })
  }

  // 編輯待辦事項
  function handleEditTask(){
    const formData = getFormData();
    if(!validateForm()) return;
    todoStore.updateTodo(selectedId.value, formData).then((success)=>{
      if(success){
        closeDialog();
      }
    })
  }

  // 刪除待辦事項
  function handleDelete(){
    todoStore.deleteTodo(selectedId.value).then((success)=>{
      if(success){
        closeDialog();
      }
    })
  }

  // 切換待辦事項完成狀態
  function handleToggleDone(){
    todoStore.toggleDone(selectedId.value).then((success)=>{
      if(success){
        closeDialog();
      }
    })
  }

  // 取得視窗寬度
  const windowWidth = ref(window.innerWidth);

  function updateWidth() {
    windowWidth.value = window.innerWidth;
  }

  onMounted(() => {
    window.addEventListener('resize', updateWidth);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateWidth);
  });

  // 取得對話框寬度
  const dialogWidth = computed(() => {
    if (windowWidth.value < 576) return '300px';         // xs
    if (windowWidth.value < 768) return '350px';         // sm
    if (windowWidth.value < 992) return '400px';         // md
    if (windowWidth.value < 1200) return '450px';        // lg
    return '500px';                                      // xl
  });
</script>
  
<template>
  <el-dialog 
    v-model="dialogFormVisible" 
    :title="dialogTitle" 
    :width="dialogWidth"
  >
    <el-form :model="form" label-position="top">
      <el-form-item label="待辦事項名稱" required>
        <el-input 
          v-model="form.name" 
          placeholder="請輸入待辦事項名稱"
          autofocus
        />
      </el-form-item>
      
      <el-form-item label="預計完成日期" required>
        <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="選擇預計完成日期"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
      </el-form-item>
        
      <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="開始時間" required>
              <el-time-select
                v-model="form.startTime"
                start="00:00"
                :step="`00:${TIME_STEP}`" 
                end="24:00"
                placeholder="選擇開始時間"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="結束時間" required>
              <el-time-select
                v-model="form.endTime"
                start="00:00"
                step="00:30"
                end="24:00"
                placeholder="選擇結束時間"
              />
            </el-form-item>
          </el-col>
      </el-row>

      <el-form-item v-if="isEditing">
        <el-checkbox v-model="form.done" @change="handleToggleDone">已完成</el-checkbox>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="handleAddTask" v-if="!isEditing">
          新增
        </el-button>
        <el-button type="primary" @click="handleEditTask" v-else>
          編輯
        </el-button>
        <el-popconfirm title="是否確認刪除?" 
            v-if="isEditing" 
            confirm-button-text="是"
            cancel-button-text="否"
            @confirm="handleDelete">
          <template #reference>
            <el-button type="danger">刪除</el-button>
          </template>
        </el-popconfirm>
      </div>
    </template>
  </el-dialog>
</template>
  