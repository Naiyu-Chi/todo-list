<script setup>
    // 使用 defineModel 來創建雙向綁定
    const visible = defineModel('visible', {
        type: Boolean,
        default: false
    });

    // 其他 props
    const props = defineProps({
        title: String,
        form: Object,
        isEditing: Boolean,
    });

    const emit = defineEmits(['cancel', 'confirm', 'delete', 'toggle-done']);

    // Handlers
    function handleCancel() {
        emit('cancel');
    }

    function handleConfirm() {
        emit('confirm');
    }

    function handleDelete(){
      emit('delete')
    }

    function handleToggleDone(){
      emit('toggle-done')
    }
</script>
  
<template>
  <el-dialog 
    v-model="visible" 
    :title="title" 
    width="450" 
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
                step="00:30"
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
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm" v-if="!isEditing">
          新增
        </el-button>
        <el-button type="primary" @click="handleConfirm" v-else>
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
  