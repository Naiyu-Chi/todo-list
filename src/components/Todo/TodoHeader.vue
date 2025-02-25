<script setup>
    import { ElInput, ElButton } from 'element-plus';

    // 用defineModal接收父元件傳遞的modelValue，並進行雙向綁定
    const keyword = defineModel('modelValue', {
        type: String,
        default: ''
    });

    const props = defineProps({
        openDialogForAdd: Function
    });
</script>

<template>
    <div class="app-header">
        <h1>待辦事項清單列表</h1>
        <div class="controls">
            <el-input 
                v-model="keyword" 
                placeholder="輸入關鍵字搜尋" 
                clearable
                class="search-input"
            />
            <el-button type="primary" @click="openDialogForAdd">新增</el-button>
        </div>
    </div>
</template>

<style scoped>
    .app-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
    }

    h1 {
        margin: 0;
    }

    .controls {
        display: flex;
        gap: 1rem;
    }

    .search-input {
        width: 250px;
    }
</style>