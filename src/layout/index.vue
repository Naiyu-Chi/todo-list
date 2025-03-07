<template>
    <el-scrollbar>
      <div class="app-container" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
        <el-container>
          <el-header height="60px" class="header-container">
            <TodoHeader 
              :is-collapsed="sidebarCollapsed"
              @toggle-sidebar="toggleSidebar"/>
          </el-header>
          <el-container>
            <el-aside width="auto" class="aside-container">
              <Sidebar 
                :is-collapsed="sidebarCollapsed"
                @toggle-sidebar="toggleSidebar" 
              />
            </el-aside>
            <el-main class="main-container">
              <router-view />
              <el-backtop target=".main-container"/>
            </el-main>
          </el-container>
        </el-container>
      </div>
  </el-scrollbar>
</template>
  
<script setup>
  import { ref } from 'vue';
  import TodoHeader from '@/components/Header.vue';
  import Sidebar from '@/components/Sidebar.vue';

  const sidebarCollapsed = ref(true);
  const toggleSidebar = () => {
    sidebarCollapsed.value =! sidebarCollapsed.value;
  };

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
  
  .main-container {
      padding: 20px;
      min-height: calc(100vh - 60px);
      margin-left: 260px;
      transition: margin-left 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  
  .sidebar-collapsed .main-container {
    margin-left: 64px;
  }
  
  .el-container {
      height: 100%;
  }
  
  .el-container .el-container {
      height: calc(100% - 60px);
  }
</style>