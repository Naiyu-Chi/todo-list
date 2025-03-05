<!-- StatCard.vue -->
<template>
    <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
      <el-card shadow="hover" class="stat-card">
        <div :class="['stat-icon', iconType]">
          <el-icon><component :is="icon" /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ value }}</div>
          <div class="stat-label">{{ label }}</div>
        </div>
      </el-card>
    </el-col>
  </template>
  
<script setup>
  defineProps({
    icon: Object,
    value: [Number, String],
    label: String,
    iconType: String
  });
</script>
  
<style scoped>
  .stat-card {
    display: flex;
    align-items: center;
    height: 100%;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    font-size: 20px;
  }
  
  .stat-icon.total {
    background-color: rgba(64, 158, 255, 0.15);
    color: #409eff;
  }
  
  .stat-icon.completed {
    background-color: rgba(103, 194, 58, 0.15);
    color: #67c23a;
  }
  
  .stat-icon.progress {
    background-color: rgba(230, 162, 60, 0.15);
    color: #e6a23c;
  }
  
  .stat-icon.rate {
    background-color: rgba(144, 147, 153, 0.15);
    color: #606266;
  }
  
  .stat-content {
    flex: 1;
  }
  
  .stat-value {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    line-height: 1.2;
  }
  
  .stat-label {
    font-size: 14px;
    color: #909399;
    margin-top: 4px;
  }
</style>