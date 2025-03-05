<template>
    <div class="app-container" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <el-container>
        <el-header height="60px" class="header-container">
          <TodoHeader />
        </el-header>
        <el-container>
          <el-aside width="auto" class="aside-container">
            <Sidebar />
          </el-aside>
          <el-main class="main-container">
            <router-view />
          </el-main>
        </el-container>
      </el-container>
    </div>
</template>
  
<script setup>
  import { ref, provide, onMounted } from 'vue';
  import TodoHeader from '@/components/Header.vue';
  import Sidebar from '@/components/Sidebar.vue';
  // sidebar收合狀態
  const sidebarCollapsed = ref(false);
  
  // 切換sidebar收合狀態
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  };
  
  provide('sidebarCollapsed', sidebarCollapsed);
  provide('toggleSidebar', toggleSidebar);
  </script>
  
  <style lang="scss" scoped>
    .app-container {
        height: 100vh;
        width: 100%;
        overflow-x: hidden;
    }
    
    .header-container {
        padding: 0;
        height: 60px;
    }
    
    .aside-container {
        width: auto !important;
    }
    
    .main-container {
        padding: 20px;
        min-height: calc(100vh - 60px);
        margin-top: 0;
        margin-left: 0;
        
        @media (min-width: 768px) {
        margin-left: 260px;
        transition: margin-left 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
    }
    
    .sidebar-collapsed .main-container {
        @media (min-width: 768px) {
            margin-left: 64px;
        }
    }
    
    .el-container {
        height: 100%;
    }
    
    .el-container .el-container {
        height: calc(100% - 60px);
    }
  </style>