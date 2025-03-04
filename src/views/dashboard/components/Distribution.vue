<template>
    <div class="weekly-chart-container">
      <h3>週任務分佈</h3>
      <div v-if="tasks.length > 0" ref="weekChartRef" class="week-chart"></div>
      <el-empty v-else description="當周沒有任務" />
    </div>
</template>
  
<script setup>
    import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
    import * as d3 from 'd3';
    
    const props = defineProps({
        tasks:Array,
        currentDate: Object
    });
  
    const weekChartRef = ref(null);
    let resizeObserver = null;
    const createWeeklyChart = () => {
        console.log("create........")
      if(props.tasks.length === 0) return;
      // 清除前一個圖表
      d3.select(weekChartRef.value).selectAll('*').remove();
      
      const daysOfWeek = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
      const dayData = daysOfWeek.map(day => ({
          day,
          count: 0
      }));
        
      // 計算每日任務數量
      props.tasks.forEach(task => {
          const date = new Date(task.date);
          const dayIndex = date.getDay(); // 0: Sunday, 1: Monday... etc.
          dayData[dayIndex].count += 1;
      });
      
      // 設置圖表尺寸
      const margin = { top: 20, right: 30, bottom: 40, left: 40 };
      const width = weekChartRef.value.clientWidth - margin.left - margin.right;
      const height = 300 - margin.top - margin.bottom;
      
      // 創建 SVG
      const svg = d3.select(weekChartRef.value)
                  .append('svg')
                  .attr('width', width + margin.left + margin.right)
                  .attr('height', height + margin.top + margin.bottom)
                  .append('g')
                  .attr('transform', `translate(${margin.left},${margin.top})`);
      
      // 設置X軸
      const x = d3.scaleBand()
                  .domain(daysOfWeek)
                  .range([0, width])
                  .padding(0.2);
      
      // 設置Y軸
      const maxCount = Math.max(...dayData.map(d => d.count));
      const yMaxValue = maxCount === 0 ? 1 : maxCount + 1;
      
      const y = d3.scaleLinear()
                  .domain([0, yMaxValue])
                  .nice()
                  .range([height, 0]);
      
      // 添加X軸到圖表
      svg.append('g')
          .attr('transform', `translate(0,${height})`)
          .call(d3.axisBottom(x))
          .selectAll('text')
          .style('font-size', '12px');
      
      const yTickValues = Array.from({ length: yMaxValue + 1 }, (_, i) => i);
  
      // 添加Y軸到圖表
      svg.append('g')
          .call(d3.axisLeft(y)
              .tickValues(yTickValues)
              .tickFormat(d3.format('d')))
          .selectAll('text')
          .style('font-size', '12px');
      
      // 顏色比例尺
      const colorScale = d3.scaleLinear()
          .domain([0, yMaxValue === 1 ? 1 : yMaxValue - 1])
          .range(['#64B5F6', '#1976D2']);
      
      // 添加bar到圖表
      svg.selectAll('.bar')
          .data(dayData)
          .enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('x', d => x(d.day))
          .attr('y', d => y(d.count))
          .attr('width', x.bandwidth())
          .attr('height', d => height - y(d.count))
          .attr('fill', d => colorScale(d.count))
          .attr('rx', 4)
          .attr('ry', 4);
          
      // 添加bar上的數字標籤
      svg.selectAll('.label')
          .data(dayData)
          .enter()
          .append('text')
          .attr('class', 'label')
          .attr('x', d => x(d.day) + x.bandwidth() / 2) // X軸偏移量
          .attr('y', d => y(d.count) - 5) // Y軸偏移量
          .attr('text-anchor', 'middle') // 文字居中
          .style('font-size', '12px')
          .style('font-weight', 'bold')
          .style('fill', '#333')
          .text(d => d.count > 0 ? d.count : '');
    };
       
    onMounted(() => {
        createWeeklyChart();
        // 監控圖表大小變化
        resizeObserver = new ResizeObserver(() => {
            createWeeklyChart();
        });
        if (weekChartRef.value) {
            resizeObserver.observe(weekChartRef.value);
        }
    });

    watch(() => props.tasks, (newTasks) => {
        if (newTasks.length > 0) {
            nextTick(() => {
                createWeeklyChart();
            });
        }
    }, { deep: true });

    watch(() => props.currentDate, () => {
        createWeeklyChart();
    });

    onBeforeUnmount(() => {
        // 移除resizeObserver
        if (resizeObserver) {
            resizeObserver.disconnect();
        }
    });
</script>
  
<style lang="scss" scoped>
    .weekly-chart-container {
        background-color: white;
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        height: 100%;
        h3 {
            margin-top: 0;
            margin-bottom: 16px;
            color: #303133;
            font-size: 18px;
        }
    }

    .week-chart {
        width: 100%;
        height: 300px;
    }
</style>