<template>
    <div class="app-header">
      <div class="left-section">
        <!-- 漢堡按鈕 -->
        <el-button 
          class="desktop-toggle-btn hidden-xs-only"
          type="primary" 
          :icon="isCollapsed ? Expand : Fold" 
          circle 
          plain
          @click="toggleSidebar"
        />
        
        <!-- 小螢幕選單按鈕 -->
        <el-button 
          class="mobile-toggle-btn"
          type="primary" 
          :icon="Menu" 
          circle 
          plain
          @click="openDrawer"
        />

        <!-- 添加路徑資訊 -->
      </div>
    </div>
  </template>
  
  <script setup>
    import { ref, inject } from 'vue';
    import { Menu, Fold, Expand } from '@element-plus/icons-vue';
    
    const isCollapsed = inject('sidebarCollapsed', ref(false));
    const toggleSidebar = inject('toggleSidebar', () => {});
    
    const openDrawer = () => {
        window.toggleDrawer();
    };
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
    
    .mobile-toggle-btn {
        @media (min-width: 768px) {
            display: none !important;
        }
    }
</style>