<template>
    <div class="app-header">
      <div class="left-section">
        <!-- 漢堡按鈕 -->
        <el-button 
          class="desktop-toggle-btn"
          type="primary" 
          :icon="props.isCollapsed ? Expand : Fold" 
          circle 
          plain
          @click="$emit('toggle-sidebar')"
        />
        <!-- 添加路徑資訊 -->
      </div>
    </div>
</template>
  
<script setup>
    import { Fold, Expand } from '@element-plus/icons-vue';

    const props = defineProps({
      isCollapsed: Boolean,
    });

    const emit = defineEmits(['toggle-sidebar', 'update-drawer-state']);
</script>
  
<style lang="scss" scoped>
    .app-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
      padding: 0 16px;
      background-color: #fff;
      border-bottom: 1px solid #ebeef5;
      z-index: 1001;
      .left-section {
        display: flex;
        align-items: center;
        .desktop-toggle-btn, .mobile-toggle-btn {
            margin-right: 12px;
        }
      }
    }
</style>