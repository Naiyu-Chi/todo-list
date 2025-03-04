<template>
    <div class="chart-container">
      <h3>任務完成狀態</h3>
      <div class="chart-wrapper">
        <div ref="chartRef" class="pie-chart"></div>
        <div class="legend">
          <div class="legend-item">
            <div class="color-box" style="background-color: #41B883;"></div>
            <span>已完成</span>
          </div>
          <div class="legend-item">
            <div class="color-box" style="background-color: #E46651;"></div>
            <span>進行中</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import * as d3 from 'd3';
  import { ref, onMounted, watch } from 'vue';
  
  const props = defineProps({
    completedCount: {
      type: Number,
      required: true
    },
    inProgressCount: {
      type: Number,
      required: true
    }
  });
  
  const chartRef = ref(null);
//   let chart = null;
  
  const createPieChart = () => {
    if (!chartRef.value) return;
    
    // 清理之前的圖表
    d3.select(chartRef.value).selectAll('*').remove();
    
    const completedCount = props.completedCount;
    const inProgressCount = props.inProgressCount;
    
    const data = [
      { label: '已完成', value: completedCount, color: '#41B883' },
      { label: '進行中', value: inProgressCount, color: '#E46651' }
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
    
    // Create pie generator
    const pie = d3.pie()
                .value(d => d.value)
                .sort(null);
    
    // Generate the arcs
    const arc = d3.arc()
                .innerRadius(0)
                .outerRadius(radius);
    
    // Generate the groups
    const arcs = svg.selectAll('arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');
    
    // Draw arc paths
    arcs.append('path')
      .attr('fill', (d, i) => data[i].color)
      .attr('d', arc)
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.8)
      .on('mouseover', function() {
        d3.select(this).style('opacity', 1);
      })
      .on('mouseout', function() {
        d3.select(this).style('opacity', 0.8);
      });
    
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
  
  onMounted(() => {
    createPieChart();
  });
  </script>
  
<style scoped>
    .chart-container {
        background-color: white;
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        margin-top: 20px;
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