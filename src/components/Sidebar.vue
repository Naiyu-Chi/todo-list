
<script setup>
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { House, DataBoard } from '@element-plus/icons-vue';

  const route = useRoute();

  const props = defineProps({
    isCollapsed: Boolean
  });

  const emit = defineEmits(['toggle-sidebar']);

  const activeIndex = computed(() => {
    return route.path;
  });
</script>

<template>
  <!-- 大螢幕選單 -->
  <div 
    class="sidebar-container" 
    :class="{ 
      'is-collapsed': props.isCollapsed 
    }"
  >
    <el-scrollbar height="100%">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-vertical"
        :collapse="props.isCollapsed"
        :router="true"
        :collapse-transition="false"
      >
        <el-menu-item-group>
          <el-menu-item index="/">
            <el-icon><House /></el-icon>
            <template #title>首頁</template>
          </el-menu-item>
          <el-menu-item index="/dashboard">
            <el-icon><DataBoard /></el-icon>
            <template #title>儀表板</template>
          </el-menu-item>
        </el-menu-item-group>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
  .sidebar-container {
    position: fixed;
    top: 60px; 
    left: 0;
    bottom: 0;
    width: 240px;
    border-right: 1px solid #e6e6e6;
    background-color: #fff;
    overflow-y: auto;
    overflow-x: hidden; 
    transition: width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    z-index: 10;
    
    &.is-collapsed {
      width: 64px;
    }
    
    .sidebar-header {
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border-bottom: 1px solid #ebeef5;
      margin-bottom: 8px;
      height: 50px;
      
      .title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        white-space: nowrap;
      }
    }

    .el-menu-vertical {
      border-right: none;
      width: 100%;
      
      &.el-menu--collapse {
        width: 64px;
      }
    }
    
    .el-menu-item {
      &.is-active {
        background-color: #ecf5ff;
        color: #409EFF;
        
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background-color: #409EFF;
        }
      }
      
      .el-icon {
        margin-right: 8px;
      }
    }
  }

  .drawer-menu {
    border-right: none;
    
    .el-menu-item {
      height: 50px;
      line-height: 50px;
    }
  }

  .drawer-header {
    font-size: 16px;
    font-weight: 600;
  }

  .mobile-drawer {
    @media (min-width: 768px) {
      display: none;
    }
  }
</style>