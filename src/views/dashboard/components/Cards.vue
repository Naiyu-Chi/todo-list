<template>
  <el-row :gutter="20">
    <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
      <el-card shadow="hover" class="stat-card">
        <div class="stat-icon total">
          <el-icon><Document /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalTasks }}</div>
          <div class="stat-label">總任務</div>
        </div>
      </el-card>
    </el-col>
    
    <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
      <el-card shadow="hover" class="stat-card">
        <div class="stat-icon completed">
          <el-icon><Check /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ completedTasks }}</div>
          <div class="stat-label">已完成</div>
        </div>
      </el-card>
    </el-col>
    
    <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
      <el-card shadow="hover" class="stat-card">
        <div class="stat-icon progress">
          <el-icon><Timer /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ inProgressTasks }}</div>
          <div class="stat-label">進行中</div>
        </div>
      </el-card>
    </el-col>
    
    <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
      <el-card shadow="hover" class="stat-card">
        <div class="stat-icon rate">
          <el-icon><DataAnalysis /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ completionRate }}%</div>
          <div class="stat-label">完成率</div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
  
<script setup>
  import { computed } from 'vue';
  import { 
    Check, 
    Timer, 
    Document, 
    DataAnalysis
  } from '@element-plus/icons-vue';
  
  const props = defineProps({
    totalTasks: Number,
    completedTasks: Number,
    inProgressTasks: Number
  });
  
  // 計算完成率
  const completionRate = computed(() => {
    if (props.totalTasks === 0) return 0;
    return Math.round((props.completedTasks / props.totalTasks) * 100);
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