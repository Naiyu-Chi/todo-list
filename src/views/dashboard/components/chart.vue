<template>
    This is a bar chart
    <div id="barchartContainer"></div>
    <svg></svg>
</template>

<script setup>
    import * as d3 from 'd3';
    import { useTodoStore } from '@/stores/modules/todo';
    const todoStore = useTodoStore();
    const props = defineProps({
    tasks:{
        type:Array
    }
    })

    console.log(todoStore.todosByWeek)
    const svg = d3.select('#barchartContainer')
                .append('svg')
                .attr('width', 1200)
                .attr('height', 800)
    console.log(svg)
</script>