<template>
    <el-affix >
        <header class="header">
            <RouterLink to="/">待辦事項清單</RouterLink>
            <RouterLink to="/dashboard">Dashbord</RouterLink>
        </header>
    </el-affix>
</template>

<script setup>
    import { RouterLink } from 'vue-router';
</script>

<style lang="scss" scoped>
    .header {
        background-color: var(--el-color-primary);
        color: white;
        padding: 24px;
        text-align: center;
        font-family: 'Arial', sans-serif;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        display:flex;
        justify-content: space-around;
        h1 {
            margin: 0;
            font-size: 2.5em;
        }
        a{
            color:white;
            text-decoration: none;
            font-size: 1rem;
            font-weight: 600;
            font-size: 20px;
        }
    }
</style>