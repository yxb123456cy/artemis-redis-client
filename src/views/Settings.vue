<script setup lang="ts">
import {ref, reactive} from 'vue';
import {Message} from '@arco-design/web-vue';

// 系统设置数据
const systemSettings = reactive({
  // 外观设置
  appearance: {
    theme: 'dark',
    accentColor: '#ff4d4f',
    fontSize: 14,
    fontFamily: 'system-ui, sans-serif',
    animationsEnabled: true
  },
  // 连接设置
  connection: {
    connectionTimeout: 5000,
    maxConnections: 10,
    autoReconnect: true,
    reconnectAttempts: 3,
    reconnectInterval: 1000,
    keepAlive: true
  },
  // 安全设置
  security: {
    encryptConnections: true,
    savePasswords: true,
    autoLockTimeout: 30,
    requireConfirmation: true,
    showSensitiveData: false
  },
  // 高级设置
  advanced: {
    enableLogging: true,
    logLevel: 'info',
    maxLogSize: 10,
    clearLogsOnExit: false,
    enableAnalytics: false,
    developerMode: false
  }
});

// 日志级别选项
const logLevelOptions = [
  {label: '错误', value: 'error'},
  {label: '警告', value: 'warn'},
  {label: '信息', value: 'info'},
  {label: '调试', value: 'debug'},
  {label: '详细', value: 'verbose'}
];

// 字体选项
const fontFamilyOptions = [
  {label: '系统默认', value: 'system-ui, sans-serif'},
  {label: 'Roboto', value: 'Roboto, sans-serif'},
  {label: 'Open Sans', value: 'Open Sans, sans-serif'},
  {label: 'Montserrat', value: 'Montserrat, sans-serif'},
  {label: '等宽字体', value: '"Courier New", monospace'}
];

// 保存设置
const saveSettings = () => {
  Message.loading('正在保存设置...');

  // 模拟保存
  setTimeout(() => {
    Message.success('设置保存成功');
  }, 800);
};

// 重置设置
const resetSettings = () => {
  // 模拟重置
  systemSettings.appearance.theme = 'dark';
  systemSettings.appearance.accentColor = '#ff4d4f';
  systemSettings.appearance.fontSize = 14;
  systemSettings.appearance.fontFamily = 'system-ui, sans-serif';
  systemSettings.appearance.animationsEnabled = true;

  systemSettings.connection.connectionTimeout = 5000;
  systemSettings.connection.maxConnections = 10;
  systemSettings.connection.autoReconnect = true;
  systemSettings.connection.reconnectAttempts = 3;
  systemSettings.connection.reconnectInterval = 1000;
  systemSettings.connection.keepAlive = true;

  systemSettings.security.encryptConnections = true;
  systemSettings.security.savePasswords = true;
  systemSettings.security.autoLockTimeout = 30;
  systemSettings.security.requireConfirmation = true;
  systemSettings.security.showSensitiveData = false;

  systemSettings.advanced.enableLogging = true;
  systemSettings.advanced.logLevel = 'info';
  systemSettings.advanced.maxLogSize = 10;
  systemSettings.advanced.clearLogsOnExit = false;
  systemSettings.advanced.enableAnalytics = false;
  systemSettings.advanced.developerMode = false;

  Message.success('设置已重置为默认值');
};

// 导出设置
const exportSettings = () => {
  // 模拟导出
  const settingsJson = JSON.stringify(systemSettings, null, 2);
  const blob = new Blob([settingsJson], {type: 'application/json'});
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'artemis-settings.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  Message.success('设置已导出');
};

// 导入设置
const importSettings = (e: any) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event: any) => {
    try {
      const importedSettings = JSON.parse(event.target.result);

      // 合并设置
      Object.assign(systemSettings.appearance, importedSettings.appearance || {});
      Object.assign(systemSettings.connection, importedSettings.connection || {});
      Object.assign(systemSettings.security, importedSettings.security || {});
      Object.assign(systemSettings.advanced, importedSettings.advanced || {});

      Message.success('设置导入成功');
    } catch (error) {
      Message.error('设置导入失败，文件格式错误');
    }
  };
  reader.readAsText(file);
};

// 清除数据
const clearDataVisible = ref(false);
const clearDataOptions = reactive({
  connections: true,
  commandHistory: true,
  savedQueries: true,
  userPreferences: false,
  cachedData: true
});

const handleClearData = () => {
  clearDataVisible.value = true;
};

const confirmClearData = () => {
  // 模拟清除数据
  Message.loading('正在清除数据...');

  setTimeout(() => {
    clearDataVisible.value = false;
    Message.success('数据清除成功');
  }, 1000);
};
</script>

<template>
  <div class="settings-container">
    <div class="page-header">
      <h1 class="page-title">系统设置</h1>
      <div class="header-actions">
        <a-space>
          <a-upload
              action=""
              :auto-upload="false"
              :show-file-list="false"
              accept=".json"
              @change="importSettings"
          >
            <a-button>
              <template #icon>
                <icon-upload/>
              </template>
              导入设置
            </a-button>
          </a-upload>
          <a-button @click="exportSettings">
            <template #icon>
              <icon-download/>
            </template>
            导出设置
          </a-button>
          <a-button status="danger" @click="handleClearData">
            <template #icon>
              <icon-delete/>
            </template>
            清除数据
          </a-button>
        </a-space>
      </div>
    </div>

    <div class="settings-content">
      <a-tabs type="card-gutter" class="settings-tabs">
        <a-tab-pane key="appearance" title="外观">
          <a-form :model="systemSettings.appearance" layout="vertical">
            <a-form-item field="theme" label="主题">
              <a-radio-group v-model="systemSettings.appearance.theme">
                <a-radio value="dark"><span style="color: #ffffff">暗色主题</span></a-radio>
                <a-radio value="light"><span style="color: #ffffff">亮色主题</span></a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item field="accentColor" label="强调色">
              <div class="color-picker-wrapper">
                <input
                    type="color"
                    v-model="systemSettings.appearance.accentColor"
                    class="color-picker"
                />
                <span class="color-value">{{ systemSettings.appearance.accentColor }}</span>
              </div>
            </a-form-item>

            <a-form-item field="fontSize" label="字体大小">
              <a-slider
                  v-model="systemSettings.appearance.fontSize"
                  :min="12"
                  :max="20"
                  :step="1"
                  show-ticks
              >
                <template #prepend>12px</template>
                <template #append>20px</template>
              </a-slider>
            </a-form-item>

            <a-form-item field="fontFamily" label="字体">
              <a-select v-model="systemSettings.appearance.fontFamily">
                <a-option
                    v-for="option in fontFamilyOptions"
                    :key="option.value"
                    :value="option.value"
                >
                  {{ option.label }}
                </a-option>
              </a-select>
            </a-form-item>

            <a-form-item field="animationsEnabled">
              <a-switch v-model="systemSettings.appearance.animationsEnabled">
                <template #checked>启用动画</template>
                <template #unchecked>禁用动画</template>
              </a-switch>
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <a-tab-pane key="connection" title="连接">
          <a-form :model="systemSettings.connection" layout="vertical">
            <a-form-item field="connectionTimeout" label="连接超时 (毫秒)">
              <a-input-number
                  v-model="systemSettings.connection.connectionTimeout"
                  :min="1000"
                  :max="30000"
                  :step="1000"
                  style="width: 100%"
              />
            </a-form-item>

            <a-form-item field="maxConnections" label="最大连接数">
              <a-input-number
                  v-model="systemSettings.connection.maxConnections"
                  :min="1"
                  :max="50"
                  :step="1"
                  style="width: 100%"
              />
            </a-form-item>

            <a-form-item field="autoReconnect">
              <a-switch v-model="systemSettings.connection.autoReconnect">
                <template #checked>自动重连</template>
                <template #unchecked>不自动重连</template>
              </a-switch>
            </a-form-item>

            <a-form-item field="reconnectAttempts" label="重连尝试次数">
              <a-input-number
                  v-model="systemSettings.connection.reconnectAttempts"
                  :min="1"
                  :max="10"
                  :step="1"
                  :disabled="!systemSettings.connection.autoReconnect"
                  style="width: 100%"
              />
            </a-form-item>

            <a-form-item field="reconnectInterval" label="重连间隔 (毫秒)">
              <a-input-number
                  v-model="systemSettings.connection.reconnectInterval"
                  :min="500"
                  :max="5000"
                  :step="500"
                  :disabled="!systemSettings.connection.autoReconnect"
                  style="width: 100%"
              />
            </a-form-item>

            <a-form-item field="keepAlive">
              <a-switch v-model="systemSettings.connection.keepAlive">
                <template #checked>保持连接</template>
                <template #unchecked>不保持连接</template>
              </a-switch>
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <a-tab-pane key="security" title="安全">
          <a-form :model="systemSettings.security" layout="vertical">
            <a-form-item field="encryptConnections">
              <a-switch v-model="systemSettings.security.encryptConnections">
                <template #checked>加密连接信息</template>
                <template #unchecked>不加密连接信息</template>
              </a-switch>
            </a-form-item>

            <a-form-item field="savePasswords">
              <a-switch v-model="systemSettings.security.savePasswords">
                <template #checked>保存密码</template>
                <template #unchecked>不保存密码</template>
              </a-switch>
            </a-form-item>

            <a-form-item field="autoLockTimeout" label="自动锁定超时 (分钟)">
              <a-input-number
                  v-model="systemSettings.security.autoLockTimeout"
                  :min="0"
                  :max="60"
                  :step="5"
                  style="width: 100%"
              >
                <template #append>0 表示不自动锁定</template>
              </a-input-number>
            </a-form-item>

            <a-form-item field="requireConfirmation">
              <a-switch v-model="systemSettings.security.requireConfirmation">
                <template #checked>危险操作需确认</template>
                <template #unchecked>不需确认</template>
              </a-switch>
            </a-form-item>

            <a-form-item field="showSensitiveData">
              <a-switch v-model="systemSettings.security.showSensitiveData">
                <template #checked>显示敏感数据</template>
                <template #unchecked>隐藏敏感数据</template>
              </a-switch>
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <a-tab-pane key="advanced" title="高级">
          <a-form :model="systemSettings.advanced" layout="vertical">
            <a-form-item field="enableLogging">
              <a-switch v-model="systemSettings.advanced.enableLogging">
                <template #checked>启用日志</template>
                <template #unchecked>禁用日志</template>
              </a-switch>
            </a-form-item>

            <a-form-item field="logLevel" label="日志级别">
              <a-select
                  v-model="systemSettings.advanced.logLevel"
                  :disabled="!systemSettings.advanced.enableLogging"
              >
                <a-option
                    v-for="option in logLevelOptions"
                    :key="option.value"
                    :value="option.value"
                >
                  {{ option.label }}
                </a-option>
              </a-select>
            </a-form-item>

            <a-form-item field="maxLogSize" label="最大日志大小 (MB)">
              <a-input-number
                  v-model="systemSettings.advanced.maxLogSize"
                  :min="1"
                  :max="100"
                  :step="1"
                  :disabled="!systemSettings.advanced.enableLogging"
                  style="width: 100%"
              />
            </a-form-item>

            <a-form-item field="clearLogsOnExit">
              <a-switch
                  v-model="systemSettings.advanced.clearLogsOnExit"
                  :disabled="!systemSettings.advanced.enableLogging"
              >
                <template #checked>退出时清除日志</template>
                <template #unchecked>保留日志</template>
              </a-switch>
            </a-form-item>

            <a-form-item field="enableAnalytics">
              <a-switch v-model="systemSettings.advanced.enableAnalytics">
                <template #checked>启用匿名使用统计</template>
                <template #unchecked>禁用使用统计</template>
              </a-switch>
            </a-form-item>

            <a-form-item field="developerMode">
              <a-switch v-model="systemSettings.advanced.developerMode">
                <template #checked>开发者模式</template>
                <template #unchecked>普通模式</template>
              </a-switch>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>

      <div class="settings-actions">
        <a-space>
          <a-button type="primary" @click="saveSettings">
            <template #icon>
              <icon-save/>
            </template>
            保存设置
          </a-button>
          <a-button @click="resetSettings">
            <template #icon>
              <icon-refresh/>
            </template>
            重置为默认
          </a-button>
        </a-space>
      </div>
    </div>

    <a-modal
        v-model:visible="clearDataVisible"
        title="清除数据"
        @ok="confirmClearData"
        ok-text="确认清除"
        :ok-button-props="{ status: 'danger' }"
    >
      <a-alert type="warning" class="clear-data-warning">
        <template #message>
          <div>
            <div><strong>警告：此操作不可撤销</strong></div>
            <div>清除数据将永久删除所选项目，且无法恢复。</div>
          </div>
        </template>
      </a-alert>

      <div class="clear-data-options">
        <a-checkbox v-model="clearDataOptions.connections">已保存的连接</a-checkbox>
        <a-checkbox v-model="clearDataOptions.commandHistory">命令历史记录</a-checkbox>
        <a-checkbox v-model="clearDataOptions.savedQueries">已保存的查询</a-checkbox>
        <a-checkbox v-model="clearDataOptions.userPreferences">用户偏好设置</a-checkbox>
        <a-checkbox v-model="clearDataOptions.cachedData">缓存数据</a-checkbox>
      </div>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
.settings-container {
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

.settings-content {
  background-color: #2a2a2a;
  border-radius: 12px;
  border: 1px solid #3a3a3a;
  overflow: hidden;
}

.settings-tabs {
  :deep(.arco-tabs-header) {
    background-color: #222;
    border-bottom: 1px solid #3a3a3a;
  }

  :deep(.arco-tabs-content) {
    padding: 24px;
  }

  :deep(.arco-tabs-tab) {
    /* color: #f5f5f5;*/

    &.arco-tabs-tab-active {
      /* color: #ff4d4f;*/
    }

    &:hover {
      /*  color: #ff7875;*/
    }
  }
}

:deep(.arco-form-item-label) {
  color: #f5f5f5;
}

:deep(.arco-radio-group) {
  color: #f5f5f5;
}

:deep(.arco-switch) {
  background-color: #4e4e4e;

  &.arco-switch-checked {
    background-color: #ff4d4f;
  }
}

:deep(.arco-slider) {
  .arco-slider-track {
    background-color: #ff4d4f;
  }

  .arco-slider-dot-active {
    border-color: #ff4d4f;
  }
}

:deep(.arco-select-view),
:deep(.arco-input-number) {
  background-color: #1a1a1a;
  border-color: #3a3a3a;
  color: #f5f5f5;

  &:hover {
    border-color: #ff4d4f;
  }

  &:focus {
    border-color: #ff4d4f;
    box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
  }
}

.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.color-picker {
  appearance: none;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  background-color: transparent;
  cursor: pointer;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: 1px solid #3a3a3a;
    border-radius: 8px;
  }
}

.color-value {
  color: #f5f5f5;
  font-weight: bolder;
  font-size: larger;
}

.settings-actions {
  padding: 16px 24px 24px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #3a3a3a;
}

.clear-data-warning {
  margin-bottom: 16px;
}

.clear-data-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;

  :deep(.arco-checkbox) {
    color: #f5f5f5;
  }

  :deep(.arco-checkbox-checked .arco-checkbox-icon) {
    background-color: #ff4d4f;
    border-color: #ff4d4f;
  }
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
</style>