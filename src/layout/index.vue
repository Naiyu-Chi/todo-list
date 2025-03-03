<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <TodoHeader />
            </el-header>
            <el-main>
                <RouterView/>
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
    import { RouterView } from 'vue-router';
    import TodoHeader from '@/components/Header.vue';
</script>

<style lang="scss" scoped>
    header{
        padding: 0;
    }
</style>