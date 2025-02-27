<script setup lang="ts">
  import TodoHeader from '@/components/Header.vue';
  import { RouterView } from 'vue-router';
</script>

<template>
   <TodoHeader />
   <RouterView/>
</template>


<style>
  body{
    font-family: sans-serif;
  }
</style>