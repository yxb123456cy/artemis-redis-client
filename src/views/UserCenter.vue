<script setup lang="ts">
import {ref, reactive} from 'vue';
import {Message} from '@arco-design/web-vue';
import {useDefaultDataStore} from "../store/defaultData.ts";

const defaultDataStore = useDefaultDataStore();
// 模拟用户数据
const userInfo = reactive({
  username: '轻叶',
  email: '2186256471@example.com',
  avatar: '',
  createdAt: new Date('2025-01-01'),
  lastLogin: new Date(),
  role: 'admin'
});

// 模拟用户偏好设置
const userPreferences = reactive({
  theme: 'dark',
  language: 'zh-CN',
  notifications: true,
  autoSave: true,
  commandHistory: true,
  maxHistoryItems: 50
});

// 模拟最近活动
const recentActivities = ref([
  {id: 1, type: 'connection', action: '创建连接', target: '本地Redis', time: new Date(Date.now() - 3600000 * 2)},
  {id: 2, type: 'data', action: '编辑键', target: 'user:1000', time: new Date(Date.now() - 3600000 * 5)},
  {id: 3, type: 'command', action: '执行命令', target: 'KEYS *', time: new Date(Date.now() - 3600000 * 8)},
  {id: 4, type: 'connection', action: '测试连接', target: '测试服务器', time: new Date(Date.now() - 3600000 * 24)},
  {id: 5, type: 'data', action: '删除键', target: 'temp:session', time: new Date(Date.now() - 3600000 * 48)}
]);

// 模拟保存的连接
const savedConnections = ref([
  {id: '1', name: '本地Redis', host: 'localhost', port: 6379, lastUsed: new Date(Date.now() - 3600000)},
  {id: '2', name: '测试服务器', host: '192.168.1.100', port: 6379, lastUsed: new Date(Date.now() - 3600000 * 24)},
  {id: '3', name: '生产服务器', host: 'redis.example.com', port: 6380, lastUsed: new Date(Date.now() - 3600000 * 72)}
]);

// 编辑个人信息
const editProfileVisible = ref(false);
const editProfileLoading = ref(false);
const editProfileForm = reactive({
  username: userInfo.username,
  email: userInfo.email
});

const handleEditProfile = () => {
  editProfileForm.username = userInfo.username;
  editProfileForm.email = userInfo.email;
  editProfileVisible.value = true;
};

const saveProfile = () => {
  editProfileLoading.value = true;

  // 模拟保存
  setTimeout(() => {
    userInfo.username = editProfileForm.username;
    userInfo.email = editProfileForm.email;

    editProfileVisible.value = false;
    editProfileLoading.value = false;
    Message.success('个人信息更新成功');
  }, 800);
};

// 保存偏好设置
const savePreferences = () => {
  Message.loading('正在保存设置...');

  // 模拟保存
  setTimeout(() => {
    Message.success('设置保存成功');
  }, 800);
};

// 格式化日期
const formatDate = (date: Date) => {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 获取活动图标
const getActivityIcon = (type: string) => {
  switch (type) {
    case 'connection':
      return 'link';
    case 'data':
      return 'storage';
    case 'command':
      return 'code';
    default:
      return 'history';
  }
};
</script>

<template>
  <div class="user-center-container">
    <div class="page-header">
      <h1 class="page-title">个人中心</h1>
    </div>

    <div class="user-center-content">
      <div class="user-profile-card">
        <div class="user-avatar">
          <a-avatar :size="80" style="background-color: #ff4d4f" :image-url="defaultDataStore.getDefaultAvatarURL">
          </a-avatar>
        </div>

        <div class="user-info">
          <h2 class="username">{{ userInfo.username }}</h2>
          <p class="user-email">{{ userInfo.email }}</p>
          <div class="user-meta">
            <a-space>
              <a-tag>{{ userInfo.role }}</a-tag>
              <span class="meta-item">
                <icon-clock-circle/> 注册于: {{ formatDate(userInfo.createdAt) }}
              </span>
              <span class="meta-item">
                <icon-history/> 上次登录: {{ formatDate(userInfo.lastLogin) }}
              </span>
            </a-space>
          </div>
        </div>

        <div class="user-actions">
          <a-button type="primary" @click="handleEditProfile">
            <template #icon>
              <icon-edit/>
            </template>
            编辑资料
          </a-button>
        </div>
      </div>

      <div class="user-content-grid">
        <a-card class="preferences-card" title="偏好设置">
          <template #extra>
            <a-button type="primary" size="small" @click="savePreferences">
              <template #icon>
                <icon-save/>
              </template>
              保存设置
            </a-button>
          </template>

          <a-form :model="userPreferences" layout="vertical">
            <a-form-item field="theme" label="界面主题">
              <a-radio-group v-model="userPreferences.theme">
                <a-radio value="dark"><span style="color: #ffffff">暗色主题</span></a-radio>
                <a-radio value="light"><span style="color: #ffffff">亮色主题</span></a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item field="language" label="界面语言">
              <a-select v-model="userPreferences.language">
                <a-option value="zh-CN">简体中文</a-option>
                <a-option value="en-US">English</a-option>
              </a-select>
            </a-form-item>

            <a-form-item field="notifications">
              <a-switch v-model="userPreferences.notifications">
                <template #checked>开启通知</template>
                <template #unchecked>关闭通知</template>
              </a-switch>
            </a-form-item>

            <a-form-item field="autoSave">
              <a-switch v-model="userPreferences.autoSave">
                <template #checked>自动保存</template>
                <template #unchecked>手动保存</template>
              </a-switch>
            </a-form-item>

            <a-form-item field="commandHistory">
              <a-switch v-model="userPreferences.commandHistory">
                <template #checked>保存命令历史</template>
                <template #unchecked>不保存历史</template>
              </a-switch>
            </a-form-item>

            <a-form-item field="maxHistoryItems" label="最大历史记录数">
              <a-slider
                  v-model="userPreferences.maxHistoryItems"
                  :min="10"
                  :max="100"
                  :step="10"
                  show-ticks
              />
            </a-form-item>
          </a-form>
        </a-card>

        <a-card class="connections-card" title="保存的连接">
          <a-list :bordered="false">
            <a-list-item v-for="conn in savedConnections" :key="conn.id">
              <div class="connection-item">
                <div class="connection-info">
                  <icon-link class="connection-icon"/>
                  <div class="connection-details">
                    <div class="connection-name">{{ conn.name }}</div>
                    <div class="connection-host">{{ conn.host }}:{{ conn.port }}</div>
                  </div>
                </div>
                <div class="connection-meta">
                  <span class="last-used">上次使用: {{ formatDate(conn.lastUsed) }}</span>
                  <a-button type="text" size="small">
                    <template #icon>
                      <icon-right/>
                    </template>
                  </a-button>
                </div>
              </div>
            </a-list-item>
          </a-list>
        </a-card>

        <a-card class="activities-card" title="最近活动">
          <a-timeline>
            <a-timeline-item
                v-for="activity in recentActivities"
                :key="activity.id"
                :dot-color="activity.type === 'data' ? '#ff4d4f' : activity.type === 'connection' ? '#2196f3' : '#52c41a'"
            >
              <div class="activity-item">
                <div class="activity-content">
                  <icon-link style="color: #F53F3F" v-if="getActivityIcon(activity.type) === 'link'"/>
                  <icon-storage style="color: #F53F3F" v-else-if="getActivityIcon(activity.type) === 'storage'"/>
                  <icon-code style="color: #F53F3F" v-else-if="getActivityIcon(activity.type) === 'code'"/>
                  <icon-history style="color: #F53F3F" v-else/>
                  <span class="activity-text">
                    <strong>{{ activity.action }}</strong> {{ activity.target }}
                  </span>
                </div>
                <span class="activity-time">{{ formatDate(activity.time) }}</span>
              </div>
            </a-timeline-item>
          </a-timeline>
        </a-card>
      </div>
    </div>

    <a-modal
        v-if="editProfileVisible"
        v-model:visible="editProfileVisible"
        title="编辑个人资料"
        @before-ok="saveProfile"
        :ok-loading="editProfileLoading"
    >
      <a-form :model="editProfileForm" layout="vertical" class="editProfileForm">
        <a-form-item field="username" label="用户名:">
          <a-input v-model="editProfileForm.username" placeholder="请输入用户名" allow-clear/>
        </a-form-item>
        <a-form-item field="email" label="邮箱:">
          <a-input v-model="editProfileForm.email" placeholder="请输入邮箱" allow-clear/>
        </a-form-item>
        <a-form-item label="头像">
          <a-upload
              action="#"
              :file-list="[]"
              :show-upload-button="false"
              list-type="picture-card"
          >
            <template #upload-button>
              <div class="upload-button">
                <icon-plus/>
                <div class="upload-text">上传头像</div>
              </div>
            </template>
          </a-upload>
          <div class="upload-tip">支持 jpg、png 格式，大小不超过 2MB</div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
.user-center-container {
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(90deg, #ff4d4f 0%, #ff7875 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.user-profile-card {
  display: flex;
  align-items: center;
  padding: 24px;
  background-color: #2a2a2a;
  border-radius: 12px;
  border: 1px solid #3a3a3a;
  margin-bottom: 24px;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
}

.user-avatar {
  flex-shrink: 0;
}

.user-info {
  flex: 1;
}

.username {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #f5f5f5;
}

.user-email {
  color: #bbb;
  margin: 0 0 12px 0;
}

.user-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    justify-content: center;
  }
}

.meta-item {
  color: #aaa;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

.user-actions {
  flex-shrink: 0;

  @media (max-width: 768px) {
    margin-top: 16px;
  }
}

.user-content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.preferences-card,
.connections-card,
.activities-card {
  background-color: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 12px;
  overflow: hidden;
  height: 100%;

  :deep(.arco-card-header) {
    border-bottom: 1px solid #3a3a3a;
  }

  :deep(.arco-card-header-title) {
    color: #f5f5f5;
    font-weight: 600;
  }
}

.connection-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.connection-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.connection-icon {
  color: #ff4d4f;
  font-size: 1.2rem;
}

.connection-name {
  font-weight: 500;
  color: #f5f5f5;
}

.connection-host {
  color: #aaa;
  font-size: 0.9rem;
}

.connection-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.last-used {
  color: #aaa;
  font-size: 0.8rem;
}

.activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.activity-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.activity-text {
  color: #f5f5f5;
}

.activity-time {
  color: #aaa;
  font-size: 0.8rem;
}

:deep(.arco-form-item-label) {
  color: #f5f5f5;
}

:deep(.arco-radio-group) {
  color: #f5f5f5;
}

:deep(.arco-select-view) {
  background-color: #1a1a1a;
  border-color: #3a3a3a;
  color: #f5f5f5;
}

:deep(.arco-switch) {
  background-color: #4e4e4e;

  &.arco-switch-checked {
    background-color: #ff4d4f;
  }
}


:deep(.arco-timeline-item-dot) {
  border-color: transparent;
}

.upload-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #f5f5f5;
}

.upload-text {
  margin-top: 8px;
  font-size: 0.9rem;
}

.upload-tip {
  color: #aaa;
  font-size: 0.8rem;
  margin-top: 8px;
}

:deep(.arco-modal) {
  background-color: #2a2a2a;
  border-radius: 12px;
  border: 1px solid #3a3a3a;
}

:deep(.arco-modal-header) {
  border-bottom: 1px solid #3a3a3a;
}

:deep(.arco-modal-title) {
  color: #f5f5f5;
}

:deep(.arco-modal-footer) {
  border-top: 1px solid #3a3a3a;
}


:deep(.arco-upload-picture-card) {
  background-color: #1a1a1a;
  border-color: #3a3a3a;

  &:hover {
    border-color: #ff4d4f;
  }
}
.editProfileForm{
  :deep(.arco-form-item-label){
    color: #0c0c0c;
  }
}

</style>