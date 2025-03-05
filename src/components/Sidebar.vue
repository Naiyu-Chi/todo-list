<template>
  <!-- 大螢幕選單 -->
  <div 
    class="sidebar-container" 
    :class="{ 
      'hidden-xs-only': true, 
      'is-collapsed': isCollapsed 
    }"
  >
    <el-scrollbar height="100%">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-vertical"
        :collapse="isCollapsed"
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
  
  <!-- 小螢幕選單 -->
  <el-drawer
    v-model="drawerVisible"
    title="導覽選單"
    direction="ltr"
    :with-header="true"
    size="240px"
    :before-close="closeDrawer"
    class="mobile-drawer"
  >
    <template #header>
      <div class="drawer-header">導覽選單</div>
    </template>
    <el-scrollbar height="calc(100% - 60px)">
      <el-menu
        :default-active="activeIndex"
        class="drawer-menu"
        :router="true"
      >
        <el-menu-item index="/">
          <el-icon><House /></el-icon>
          <span>首頁</span>
        </el-menu-item>
        <el-menu-item index="/dashboard">
          <el-icon><DataBoard /></el-icon>
          <span>儀表板</span>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
  </el-drawer>
</template>

<script setup>
  import { ref, computed, inject } from 'vue';
  import { useRoute } from 'vue-router';
  import { House, DataBoard } from '@element-plus/icons-vue';

  const route = useRoute();

  const isCollapsed = inject('sidebarCollapsed', ref(false));
  const drawerVisible = ref(false);

  const toggleDrawer = () => {
    drawerVisible.value = !drawerVisible.value;
  };

  const existingToggleDrawer = inject('toggleDrawer', null);
  if (existingToggleDrawer === null) {
    window.toggleDrawer = toggleDrawer;
  } 

  const activeIndex = computed(() => {
    return route.path;
  });

  function closeDrawer(){
    drawerVisible.value = false;
  }
</script>

<style lang="scss" scoped>
  .sidebar-container {
    position: fixed;
    top: 60px; 
    left: 0;
    bottom: 0;
    width: 260px;
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
      height: 40px;
      line-height: 40px;
      
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