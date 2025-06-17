<script setup lang="ts">
import {computed} from 'vue';
import {useRoute, useRouter} from 'vue-router';



const router = useRouter();
const route = useRoute();
const activeKey = computed(() => route.path);
const goHome = () => {
  router.push("/");
}
const handleMenuClick = (key: string) => {
  router.push(key);
};
</script>

<template>
  <div class="layout">
    <header class="header">
      <div class="logo-container">
        <img src="/DeviconPlainRedis.svg" alt="Logo" class="logo"/>
        <h1 class="app-title" @click="goHome">Artemis Redis Client</h1>
      </div>
      <a-menu
          mode="horizontal"
          :selected-keys="[activeKey]"
          @menu-item-click="handleMenuClick"
          class="main-menu"
      >
        <a-menu-item key="/">首页</a-menu-item>
        <a-menu-item key="/connections">Redis连接管理</a-menu-item>
        <a-menu-item key="/data-management">Redis数据管理</a-menu-item>
        <a-menu-item key="/redis-cli">Redis命令行</a-menu-item>
        <a-menu-item key="/user-center">个人中心</a-menu-item>
        <a-menu-item key="/settings">系统设置</a-menu-item>
      </a-menu>
      <div>
        <a-avatar image-url="https://yzujcnshvfnzphdlkecu.supabase.co/storage/v1/object/public/password-qy/public/avatar/1749973056867_28.jpg">
        </a-avatar>
      </div>
    </header>
    <main class="main-content">
      <router-view/>
    </main>
    <footer class="footer">
      <p>© 2025 Artemis Redis Client. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped lang="less">
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #1a1a1a;
  color: #f5f5f5;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
  background-color: #f7f8fa;
  border-bottom: 1px solid #2a2a2a;
  box-shadow: 0 2px 6px #CB272D;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  height: 32px;
  margin-right: 12px;
}

.app-title {
  /*  todo 为项目标题添加跳转首页*/
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(90deg, #ff4d4f 0%, #ff7875 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.main-menu {
  flex: 1;
  display: flex;
  justify-content: center;
  background-color: transparent;
  border-bottom: none;
}

:deep(.arco-menu-light) {
  background-color: transparent;
}



.main-content {
  flex: 1;
  padding: 24px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.footer {
  text-align: center;
  padding: 16px;
  background-color: #0c0c0c;
  color: #888;
  font-size: 18px;
}
</style>