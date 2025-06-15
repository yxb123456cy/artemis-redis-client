<script setup lang="ts">
const features = [
  {
    title: 'Redis连接管理',
    description: '便捷管理多个Redis连接，支持密码保护和连接测试',
    icon: 'link',
    route: '/connections'
  },
  {
    title: 'Redis数据管理',
    description: '可视化查看和编辑Redis数据，支持多种数据类型',
    icon: 'storage',
    route: '/data-management'
  },
  {
    title: 'Redis命令行',
    description: '提供类似Redis-CLI的命令行界面，执行Redis命令',
    icon: 'code',
    route: '/redis-cli'
  },
  {
    title: '个人中心',
    description: '管理个人信息和偏好设置',
    icon: 'user',
    route: '/user-center'
  },
  {
    title: '系统设置',
    description: '自定义应用主题和行为',
    icon: 'settings',
    route: '/settings'
  }
];
</script>

<template>
  <div class="home-container">
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title" >Artemis Redis Client</h1>
        <p class="hero-subtitle">强大、美观的Redis可视化管理工具</p>
        <div class="hero-actions">
          <a-button type="primary" size="large" shape="round" @click="$router.push('/connections')" status="danger">
            开始使用
            <template #icon>
              <icon-right/>
            </template>
          </a-button>
          <a-button size="large" shape="round">
            了解更多
            <template #icon>
              <icon-info-circle/>
            </template>
          </a-button>
        </div>
      </div>
      <div class="hero-image">
        <img src="/vite.svg" alt="Hero Image"/>
      </div>
    </section>

    <section class="features">
      <h2 class="section-title">主要功能</h2>
      <div class="feature-grid">
        <a-card v-for="(feature, index) in features" :key="index" class="feature-card"
                :style="{ animationDelay: `${index * 0.1}s` }" hoverable @click="$router.push(feature.route)">
          <template #cover>
            <div class="feature-icon">
              <icon-link v-if="feature.icon === 'link'"/>
              <icon-storage v-else-if="feature.icon === 'storage'"/>
              <icon-code v-else-if="feature.icon === 'code'"/>
              <icon-user v-else-if="feature.icon === 'user'"/>
              <icon-settings v-else-if="feature.icon === 'settings'"/>
            </div>
          </template>
          <a-card-meta>
            <template #title>{{ feature.title }}</template>
            <template #description>{{ feature.description }}</template>
          </a-card-meta>
        </a-card>
      </div>
    </section>

    <section class="cta">
      <div class="cta-content">
        <h2 class="cta-title">准备好开始使用了吗？</h2>
        <p class="cta-description">立即创建您的第一个Redis连接，体验Artemis Redis Client的强大功能</p>
        <a-button type="primary" status="danger" size="large" shape="round" @click="$router.push('/connections')">
          创建连接
          <template #icon>
            <icon-plus/>
          </template>
        </a-button>
      </div>
    </section>
  </div>
</template>

<style scoped lang="less">
.home-container {
  width: 100%;
}

.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 0;
  gap: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
}

.hero-content {
  flex: 1;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(90deg, #ff4d4f 0%, #ff7875 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
  cursor: pointer;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: #f5f5f5;
  margin-bottom: 32px;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  gap: 16px;

  @media (max-width: 768px) {
    justify-content: center;
  }
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-width: 100%;
    height: auto;
    filter: drop-shadow(0 0 20px rgba(255, 77, 79, 0.3));
    animation: float 6s ease-in-out infinite;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 40px;
  text-align: center;
  color: #f5f5f5;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #ff4d4f 0%, #ff7875 100%);
    border-radius: 2px;
  }
}

.features {
  padding: 60px 0;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.feature-card {
  background-color: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    border-color: #ff4d4f;
  }

  :deep(.arco-card-header) {
    border-bottom: none;
  }

  :deep(.arco-card-meta-title) {
    color: #f5f5f5;
    font-size: 1.2rem;
    font-weight: 600;
  }

  :deep(.arco-card-meta-description) {
    color: #bbb;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  color: #ff4d4f;
  font-size: 3rem;
}

.cta {
  margin-top: 60px;
  padding: 60px 40px;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border-radius: 16px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%23ff4d4f" fill-opacity="0.05" width="50" height="50" x="0" y="0"/></svg>');
    opacity: 0.5;
  }
}

.cta-content {
  position: relative;
  z-index: 1;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #f5f5f5;
}

.cta-description {
  font-size: 1.2rem;
  color: #bbb;
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
</style>