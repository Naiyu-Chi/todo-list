<template>
    <div class="timeline-container">
      <h3>本週任務時間軸</h3>
      <div ref="timelineRef" class="timeline-chart"></div>
    </div>
  </template>
  
  <script setup>
  import * as d3 from 'd3';
  import { ref, onMounted, watch } from 'vue';
  
  const props = defineProps({
    tasks: {
      type: Array,
      required: true
    }
  });
  
  const timelineRef = ref(null);
  
  const createTimeline = () => {
    if (!timelineRef.value || !props.tasks || props.tasks.length === 0) return;
    
    // Clear previous chart
    d3.select(timelineRef.value).selectAll('*').remove();
    
    // Process data for timeline
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);
    
    // Set up dimensions
    const margin = { top: 40, right: 30, bottom: 30, left: 60 };
    const width = timelineRef.value.clientWidth - margin.left - margin.right;
    const height = 180 - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select(timelineRef.value)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Set up scales
    const x = d3.scaleTime()
      .domain([startOfWeek, endOfWeek])
      .range([0, width]);
    
    // Add X axis with days
    const xAxis = d3.axisBottom(x)
      .ticks(7)
      .tickFormat(d => {
        const day = d.getDay();
        const date = d.getDate();
        const days = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
        return `${days[day]}\n${date}`;
      });
    
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'middle')
      .style('font-size', '11px');
    
    // Today marker
    if (today >= startOfWeek && today <= endOfWeek) {
      const todayX = x(today);
      
      svg.append('line')
        .attr('x1', todayX)
        .attr('x2', todayX)
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', '#FF5252')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,3');
      
      svg.append('text')
        .attr('x', todayX)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .style('fill', '#FF5252')
        .text('今天');
    }
    
    // Task circles
    props.tasks.forEach((task, i) => {
      const taskDate = new Date(task.date);
      
      // Skip tasks outside current week
      if (taskDate < startOfWeek || taskDate > endOfWeek) return;
      
      const taskX = x(taskDate);
      // Spread tasks on same day vertically
      const taskY = height / 2;
      
      // Task circle
      svg.append('circle')
        .attr('cx', taskX)
        .attr('cy', taskY)
        .attr('r', 8)
        .attr('fill', task.done ? '#67C23A' : '#409EFF')
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseover', function(event) {
          d3.select(this).attr('r', 10);
          
          // Add tooltip
          const tooltip = svg.append('g')
            .attr('class', `tooltip-${i}`);
          
          // Background rectangle
          tooltip.append('rect')
            .attr('x', taskX - 80)
            .attr('y', taskY - 50)
            .attr('width', 160)
            .attr('height', 40)
            .attr('fill', 'white')
            .attr('stroke', '#DCDFE6')
            .attr('rx', 4)
            .attr('ry', 4);
          
          // Task name
          tooltip.append('text')
            .attr('x', taskX)
            .attr('y', taskY - 35)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text(task.name);
          
          // Task time
          tooltip.append('text')
            .attr('x', taskX)
            .attr('y', taskY - 20)
            .attr('text-anchor', 'middle')
            .style('font-size', '10px')
            .text(`${task.startTime} - ${task.endTime}`);
        })
        .on('mouseout', function() {
          d3.select(this).attr('r', 8);
          svg.select(`.tooltip-${i}`).remove();
        });
    });
  };
  
  onMounted(() => {
    createTimeline();
    
    // Handle window resize
    window.addEventListener('resize', createTimeline);
  });
  
  watch(() => props.tasks, () => {
    createTimeline();
  }, { deep: true });
  </script>
  
  <style scoped>
  .timeline-container {
    background-color: white;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin-top: 20px;
  }
  
  .timeline-container h3 {
    margin-top: 0;
    margin-bottom: 16px;
    color: #303133;
    font-size: 18px;
  }
  
  .timeline-chart {
    width: 100%;
    height: 180px;
  }
</style>