<template>
  <div class="chart-container">
    <h3>任務完成狀態</h3>
    <div v-if="hasData" class="chart-wrapper">
      <!-- 圖表放置容器 -->
      <div ref="chartRef" class="pie-chart"></div>
      <!-- 圖表說明欄位 -->
      <div class="legend">
        <div class="legend-item">
          <div class="color-box" style="background-color: #41B883;"></div>
          <span>已完成</span>
        </div>
        <div class="legend-item">
          <div class="color-box" style="background-color: #64B5F6;"></div>
          <span>進行中</span>
        </div>
      </div>
    </div>
    <el-empty v-else description="當周沒有任務" />
  </div>
</template>
  
<script setup>
  import * as d3 from 'd3';
  import { ref, onMounted, onBeforeUnmount, watch, computed, nextTick } from 'vue';

  const props = defineProps({
    completedCount: Number,
    inProgressCount: Number
  });

  const chartRef = ref(null);
  let resizeObserver = null;

  // 計算屬性，判斷是否有資料
  const hasData = computed(() => {
    return (props.completedCount > 0 || props.inProgressCount > 0);
  });

  const createPieChart = () => {
    if (!chartRef.value || !hasData.value) return;
    
    // 清理之前的圖表
    d3.select(chartRef.value).selectAll('*').remove();
    
    const completedCount = props.completedCount;
    const inProgressCount = props.inProgressCount;
    
    const data = [
      { label: '已完成', value: completedCount, color: '#41B883' },
      { label: '進行中', value: inProgressCount, color: '#64B5F6' }
    ];
    
    // 設置圓餅圖尺寸
    const width = 220;
    const height = 220;
    const margin = 20;
    const radius = Math.min(width, height) / 2 - margin / 2; // 半徑
    
    // 創建SVG
    const svg = d3.select(chartRef.value)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
    
    const pie = d3.pie()
                .value(d => d.value)
                .sort(null);
    
    // 繪製弧形
    const arc = d3.arc()
                .innerRadius(0) // 內圈半徑
                .outerRadius(radius);
    
    const arcs = svg.selectAll('arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');
    
    arcs.append('path')
        .attr('fill', (d, i) => data[i].color)
        .attr('d', arc)
        .attr('stroke', 'white')
        .style('stroke-width', '2px')
    
    // 添加文字標籤
    arcs.filter(d => d.data.value > 0) 
      .append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .style('fill', '#fff')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text(d => d.data.value > 0 ? d.data.value : '');
  };
  
  watch(
    () => [props.completedCount, props.inProgressCount],
    () => {
      nextTick(() => {
        createPieChart();
      });
    },
    { deep: true }
  );
  
  onMounted(() => {
    nextTick(() => {
      createPieChart();
      
      resizeObserver = new ResizeObserver(() => {
        createPieChart();
      });
      
      if (chartRef.value && hasData.value) {
        resizeObserver.observe(chartRef.value);
      }
    });
  });
  
  onBeforeUnmount(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  });
</script>
  
<style scoped>
    .chart-container {
      background-color: white;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      height: 100%; 
      display: flex;
      flex-direction: column;
    }
    
    .chart-container h3 {
        margin-top: 0;
        margin-bottom: 16px;
        color: #303133;
        font-size: 18px;
    }
    
    .chart-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .pie-chart {
        width: 220px;
        height: 220px;
    }
    
    .legend {
        display: flex;
        justify-content: center;
        margin-top: 16px;
        gap: 20px;
    }
    
    .legend-item {
        display: flex;
        align-items: center;
        margin-right: 16px;
    }
    
    .color-box {
        width: 16px;
        height: 16px;
        margin-right: 8px;
        border-radius: 3px;
    }
    
    @media (max-width: 768px) {
        .pie-chart {
          width: 240px;
          height: 200px;
        }
    }
</style>