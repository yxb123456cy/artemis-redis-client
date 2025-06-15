<script setup lang="ts">
import {ref} from 'vue';
import {Message} from '@arco-design/web-vue';

// 模拟的Redis连接
const connections = ref([
  {id: '1', name: '本地Redis', host: 'localhost', port: 6379},
  {id: '2', name: '测试服务器', host: '192.168.1.100', port: 6379},
  {id: '3', name: '生产服务器', host: 'redis.example.com', port: 6380}
]);

const currentConnection = ref(connections.value[0]);
const searchPattern = ref('');
const selectedDb = ref(0);
const dataType = ref('string');
const keyList = ref([]);
const selectedKey = ref('');
const keyValue = ref('');
const keyTTL = ref(0);
const loading = ref(false);
const editMode = ref(false);

// 模拟的数据类型选项
const dataTypes = [
  {label: 'String', value: 'string'},
  {label: 'List', value: 'list'},
  {label: 'Hash', value: 'hash'},
  {label: 'Set', value: 'set'},
  {label: 'Sorted Set', value: 'zset'}
];

// 模拟的数据库选项
const databases = Array.from({length: 16}, (_, i) => ({
  label: `DB ${i}`,
  value: i
}));

// 模拟的键列表数据
const mockKeyList = [
  {key: 'user:1000', type: 'string', size: '42 bytes', ttl: -1},
  {key: 'products', type: 'hash', size: '1.2 KB', ttl: 3600},
  {key: 'recent_visitors', type: 'list', size: '532 bytes', ttl: 86400},
  {key: 'tags', type: 'set', size: '128 bytes', ttl: -1},
  {key: 'leaderboard', type: 'zset', size: '2.1 KB', ttl: 604800}
];

// 模拟加载键列表
const loadKeys = () => {
  loading.value = true;
  setTimeout(() => {
    keyList.value = mockKeyList.filter(item => {
      if (!searchPattern.value) return true;
      return item.key.includes(searchPattern.value);
    });
    loading.value = false;
  }, 500);
};

// 初始加载
loadKeys();

// 搜索键
const handleSearch = () => {
  loadKeys();
};

// 选择键
const handleSelectKey = (key) => {
  selectedKey.value = key.key;
  // 模拟加载键值
  loading.value = true;
  setTimeout(() => {
    if (key.type === 'string') {
      keyValue.value = JSON.stringify({id: 1000, name: 'John Doe', email: 'john@example.com'}, null, 2);
    } else if (key.type === 'hash') {
      keyValue.value = JSON.stringify({
        'id': '1001',
        'name': 'Smartphone',
        'price': '599.99',
        'stock': '42'
      }, null, 2);
    } else if (key.type === 'list') {
      keyValue.value = JSON.stringify([
        '192.168.1.1',
        '10.0.0.1',
        '172.16.0.1'
      ], null, 2);
    } else if (key.type === 'set') {
      keyValue.value = JSON.stringify([
        'technology',
        'programming',
        'database',
        'redis'
      ], null, 2);
    } else if (key.type === 'zset') {
      keyValue.value = JSON.stringify([
        {'member': 'user1', 'score': '1000'},
        {'member': 'user2', 'score': '2500'},
        {'member': 'user3', 'score': '1800'}
      ], null, 2);
    }
    keyTTL.value = key.ttl;
    dataType.value = key.type;
    loading.value = false;
  }, 300);
};

// 切换编辑模式
const toggleEditMode = () => {
  editMode.value = !editMode.value;
};

// 保存键值
const saveKeyValue = () => {
  loading.value = true;
  setTimeout(() => {
    Message.success('数据保存成功');
    editMode.value = false;
    loading.value = false;
  }, 500);
};

// 删除键
const deleteKey = () => {
  loading.value = true;
  setTimeout(() => {
    keyList.value = keyList.value.filter(item => item.key !== selectedKey.value);
    selectedKey.value = '';
    keyValue.value = '';
    Message.success('键删除成功');
    loading.value = false;
  }, 500);
};

// 刷新键列表
const refreshKeys = () => {
  loadKeys();
};

// 更新TTL
const updateTTL = () => {
  loading.value = true;
  setTimeout(() => {
    Message.success('TTL更新成功');
    loading.value = false;
  }, 500);
};

// 切换数据库
const handleDbChange = () => {
  loadKeys();
};

// 切换连接
const handleConnectionChange = () => {
  loadKeys();
};
</script>

<template>
  <div class="data-management-container">
    <div class="page-header">
      <h1 class="page-title">Redis数据管理</h1>
    </div>

    <div class="data-management-content">
      <div class="connection-bar">
        <a-space>
          <a-select
              v-model="currentConnection"
              placeholder="选择Redis连接"
              style="width: 200px"
              @change="handleConnectionChange"
          >
            <a-option
                v-for="conn in connections"
                :key="conn.id"
                :value="conn"
            >
              {{ conn.name }} ({{ conn.host }}:{{ conn.port }})
            </a-option>
          </a-select>

          <a-select
              v-model="selectedDb"
              placeholder="选择数据库"
              style="width: 120px"
              @change="handleDbChange"
          >
            <a-option
                v-for="db in databases"
                :key="db.value"
                :value="db.value"
            >
              {{ db.label }}
            </a-option>
          </a-select>

          <a-input-search
              v-model="searchPattern"
              placeholder="搜索键 (支持模式匹配)"
              search-button
              @search="handleSearch"
              style="width: 300px"
          />

          <a-button type="primary" @click="refreshKeys">
            <template #icon>
              <icon-refresh/>
            </template>
            刷新
          </a-button>
        </a-space>
      </div>

      <div class="data-explorer">
        <div class="key-list-panel">
          <div class="panel-header">
            <h3>键列表</h3>
            <a-tag>{{ keyList.length }} 个键</a-tag>
          </div>

          <a-spin :loading="loading" class="key-list-spinner">
            <a-list :bordered="false" class="key-list">
              <a-list-item
                  v-for="item in keyList"
                  :key="item.key"
                  class="key-list-item"
                  :class="{ 'selected': selectedKey === item.key }"
                  @click="handleSelectKey(item)"
              >
                <div class="key-item-content">
                  <div class="key-name">
                    <a-tag
                        :color="{
                        'string': 'blue',
                        'hash': 'green',
                        'list': 'orange',
                        'set': 'purple',
                        'zset': 'red'
                      }[item.type]"
                        size="small"
                    >
                      {{ item.type }}
                    </a-tag>
                    <span class="key-text">{{ item.key }}</span>
                  </div>
                  <div class="key-meta">
                    <span class="key-size">{{ item.size }}</span>
                    <span class="key-ttl" :class="{ 'no-expire': item.ttl === -1 }">
                      {{ item.ttl === -1 ? '永不过期' : `TTL: ${item.ttl}s` }}
                    </span>
                  </div>
                </div>
              </a-list-item>
            </a-list>
          </a-spin>
        </div>

        <div class="key-value-panel">
          <div class="panel-header">
            <h3>{{ selectedKey || '未选择键' }}</h3>
            <div class="key-actions" v-if="selectedKey">
              <a-space>
                <a-select v-model="dataType" disabled style="width: 120px">
                  <a-option
                      v-for="type in dataTypes"
                      :key="type.value"
                      :value="type.value"
                  >
                    {{ type.label }}
                  </a-option>
                </a-select>

                <a-input-number
                    v-model="keyTTL"
                    placeholder="TTL (秒)"
                    :min="-1"
                    style="width: 120px"
                />
                <a-button size="small" @click="updateTTL">
                  <template #icon>
                    <icon-check-circle/>
                  </template>
                  更新TTL
                </a-button>

                <a-button
                    type="primary"
                    status="success"
                    size="small"
                    v-if="!editMode"
                    @click="toggleEditMode"
                >
                  <template #icon>
                    <icon-edit/>
                  </template>
                  编辑
                </a-button>
                <a-button
                    type="primary"
                    status="success"
                    size="small"
                    v-else
                    @click="saveKeyValue"
                >
                  <template #icon>
                    <icon-safe/>
                  </template>
                  保存
                </a-button>

                <a-popconfirm
                    content="确定要删除此键吗？"
                    @ok="deleteKey"
                >
                  <a-button type="primary" status="danger" size="small">
                    <template #icon>
                      <icon-delete/>
                    </template>
                    删除
                  </a-button>
                </a-popconfirm>
              </a-space>
            </div>
          </div>

          <a-spin :loading="loading" class="key-value-spinner">
            <div class="key-value-content" v-if="selectedKey">
              <a-textarea
                  v-model="keyValue"
                  :readonly="!editMode"
                  :auto-size="{ minRows: 10, maxRows: 20 }"
                  class="value-editor"
                  :class="{ 'editor-readonly': !editMode }"
              />
            </div>
            <div class="no-key-selected" v-else>
              <a-empty description="请从左侧列表选择一个键">
                <template #image>
                  <icon-dashboard style="font-size: 48px; color: #ff4d4f"/>
                </template>
              </a-empty>
            </div>
          </a-spin>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.data-management-container {
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

.connection-bar {
  margin-bottom: 16px;
  padding: 16px;
  background-color: #2a2a2a;
  border-radius: 8px;
  border: 1px solid #3a3a3a;
}

.data-explorer {
  display: flex;
  gap: 16px;
  height: calc(100vh - 240px);
  min-height: 500px;
}

.key-list-panel,
.key-value-panel {
  background-color: #2a2a2a;
  border-radius: 8px;
  border: 1px solid #3a3a3a;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.key-list-panel {
  width: 35%;
  min-width: 300px;
}

.key-value-panel {
  flex: 1;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #3a3a3a;
  background-color: #222;

  h3 {
    margin: 0;
    font-size: 1rem;
    color: #f5f5f5;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }
}

.key-list-spinner,
.key-value-spinner {
  flex: 1;
  overflow: auto;
}

.key-list {
  height: 100%;
  overflow: auto;
}

.key-list-item {
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid #3a3a3a;
  padding: 8px 16px;

  &:hover {
    background-color: #333;
  }

  &.selected {
    background-color: rgba(255, 77, 79, 0.1);
    border-left: 3px solid #ff4d4f;
  }
}

.key-item-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.key-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.key-text {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #f5f5f5;
  word-break: break-all;
}

.key-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #aaa;
}

.key-ttl {
  &.no-expire {
    color: #52c41a;
  }
}

.key-value-content {
  padding: 16px;
  height: 100%;
}

.value-editor {
  width: 100%;
  height: 100%;
  font-family: 'Courier New', monospace;
  background-color: #1a1a1a;
  color: #f5f5f5;
  border-color: #3a3a3a;
  border-radius: 4px;

  &.editor-readonly {
    background-color: #222;
  }

  &:hover {
    border-color: #ff4d4f;
  }

  &:focus {
    border-color: #ff4d4f;
    box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
  }
}

.no-key-selected {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #888;
}

:deep(.arco-select) {
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

:deep(.arco-select-view) {
  background-color: #1a1a1a;
  border-color: #3a3a3a;
  color: #f5f5f5;
}

:deep(.arco-input) {
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

:deep(.arco-tag) {
  border: none;
}

:deep(.arco-input-search-button) {
  background-color: #ff4d4f;
  border-color: #ff4d4f;
  color: #fff;

  &:hover {
    background-color: #ff7875;
    border-color: #ff7875;
  }
}

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
</style>