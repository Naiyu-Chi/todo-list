<template>
    <el-card class="week-navigator">
      <div class="navigation-container">
        <el-button 
            circle 
            :icon="ArrowLeft" 
            @click="calendar.goToPreviousWeek"
        />
        <div class="week-selector">
            <span>{{ weekRangeText }}</span>
            <el-button type="primary" size="small" @click="calendar.goToToday">本週</el-button>
        </div>
        <el-button 
            circle 
            :icon="ArrowRight" 
            @click="calendar.goToNextWeek"
        />
      </div>
    </el-card>
</template>
  
<script setup>
    import { computed } from 'vue';
    import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
    const props = defineProps({
        calendar: Object,
        weekStart: Date,
        weekEnd: Date
    });
  
    // 格式化的週日期範圍
    const weekRangeText = computed(() => {
        const start = props.weekStart;
        const end = props.weekEnd;
        
        const startMonth = String(start.getMonth() + 1).padStart(2, '0');
        const startDay = String(start.getDate()).padStart(2, '0');
        
        const endMonth = String(end.getMonth() + 1).padStart(2, '0');
        const endDay = String(end.getDate()).padStart(2, '0');
        
        return `${startMonth}/${startDay} - ${endMonth}/${endDay}`;
    });
</script>
  
<style scoped>
    .week-navigator {
        margin-bottom: 20px;
    }
  
    .navigation-container {
        display: flex;
        align-items: center;
        justify-content: center;
    }
  
    .week-selector {
        display: flex;
        align-items: center;
        margin: 0 20px;
        gap: 10px;
        font-size: 16px;
        font-weight: 500;
    }
</style>