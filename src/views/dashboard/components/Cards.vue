<template>
  <el-row :gutter="20">
    <StatusCard 
      :icon="Document" 
      :value="totalTasks" 
      label="總任務" 
      iconType="total" 
    />
    <StatusCard 
      :icon="Check" 
      :value="completedTasks" 
      label="已完成" 
      iconType="completed" 
    />
    <StatusCard 
      :icon="Timer" 
      :value="inProgressTasks" 
      label="進行中" 
      iconType="progress" 
    />
    <StatusCard 
      :icon="DataAnalysis" 
      :value="`${completionRate}%`" 
      label="完成率" 
      iconType="rate" 
    />
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
  import StatusCard from './StatusCard.vue';

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