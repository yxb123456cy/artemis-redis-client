<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { Message } from '@arco-design/web-vue';

// 模拟的Redis连接
const connections = ref([
  { id: '1', name: '本地Redis', host: 'localhost', port: 6379 },
  { id: '2', name: '测试服务器', host: '192.168.1.100', port: 6379 },
  { id: '3', name: '生产服务器', host: 'redis.example.com', port: 6380 }
]);

const currentConnection = ref(connections.value[0]);
const commandInput = ref('');
const commandHistory = ref([]);
const commandResults = ref([]);
const loading = ref(false);
const historyIndex = ref(-1);

// 模拟执行Redis命令
const executeCommand = () => {
  if (!commandInput.value.trim()) return;
  
  loading.value = true;
  const command = commandInput.value.trim();
  
  // 添加到历史记录
  commandHistory.value.unshift(command);
  historyIndex.value = -1;
  
  // 模拟命令执行
  setTimeout(() => {
    let result;
    const commandLower = command.toLowerCase();
    
    if (commandLower.startsWith('ping')) {
      result = { type: 'string', value: 'PONG' };
    } else if (commandLower.startsWith('get')) {
      const key = command.split(' ')[1];
      if (key === 'user:1000') {
        result = { type: 'string', value: '{"id":1000,"name":"John Doe","email":"john@example.com"}' };
      } else if (key === 'counter') {
        result = { type: 'string', value: '42' };
      } else {
        result = { type: 'nil', value: '(nil)' };
      }
    } else if (commandLower.startsWith('set')) {
      result = { type: 'status', value: 'OK' };
    } else if (commandLower.startsWith('hgetall')) {
      const key = command.split(' ')[1];
      if (key === 'products') {
        result = {
          type: 'hash',
          value: [
            'id', '1001',
            'name', 'Smartphone',
            'price', '599.99',
            'stock', '42'
          ]
        };
      } else {
        result = { type: 'empty', value: '(empty array)' };
      }
    } else if (commandLower.startsWith('lrange')) {
      result = {
        type: 'array',
        value: [
          '192.168.1.1',
          '10.0.0.1',
          '172.16.0.1'
        ]
      };
    } else if (commandLower.startsWith('keys')) {
      result = {
        type: 'array',
        value: [
          'user:1000',
          'products',
          'recent_visitors',
          'tags',
          'leaderboard'
        ]
      };
    } else if (commandLower.startsWith('info')) {
      result = {
        type: 'multi',
        value: [
          '# Server',
          'redis_version:6.2.6',
          'redis_mode:standalone',
          'os:Linux 5.4.0-91-generic x86_64',
          '',
          '# Clients',
          'connected_clients:1',
          'blocked_clients:0',
          '',
          '# Memory',
          'used_memory:1032216',
          'used_memory_human:1008.02K',
          'used_memory_peak:1032216',
          'used_memory_peak_human:1008.02K'
        ]
      };
    } else if (commandLower === 'help') {
      result = {
        type: 'help',
        value: [
          'Redis CLI 帮助:',
          'PING - 测试连接',
          'GET key - 获取键值',
          'SET key value - 设置键值',
          'KEYS pattern - 查找键',
          'INFO - 服务器信息',
          'HELP - 显示帮助'
        ]
      };
    } else {
      result = { type: 'error', value: 'ERR unknown command' };
    }
    
    commandResults.value.unshift({
      command,
      result,
      timestamp: new Date().toLocaleTimeString()
    });
    
    commandInput.value = '';
    loading.value = false;
  }, 300);
};

// 处理键盘事件，支持上下键浏览历史命令
const handleKeyDown = (e) => {
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (historyIndex.value < commandHistory.value.length - 1) {
      historyIndex.value++;
      commandInput.value = commandHistory.value[historyIndex.value];
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex.value > 0) {
      historyIndex.value--;
      commandInput.value = commandHistory.value[historyIndex.value];
    } else if (historyIndex.value === 0) {
      historyIndex.value = -1;
      commandInput.value = '';
    }
  }
};

// 清空命令结果
const clearResults = () => {
  commandResults.value = [];
};

// 切换连接
const handleConnectionChange = () => {
  Message.info(`已切换到 ${currentConnection.value.name}`);
};

// 自动聚焦到命令输入框
onMounted(() => {
  const inputEl = document.getElementById('command-input');
  if (inputEl) {
    inputEl.focus();
  }
});
</script>

<template>
  <div class="redis-cli-container">
    <div class="page-header">
      <h1 class="page-title">Redis命令行</h1>
    </div>
    
    <div class="redis-cli-content">
      <div class="connection-bar">
        <a-space>
          <a-select
            v-model="currentConnection"
            placeholder="选择Redis连接"
            style="width: 250px"
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
          
          <a-button type="primary" status="danger" @click="clearResults">
            <template #icon><a-icon-delete /></template>
            清空结果
          </a-button>
        </a-space>
      </div>
      
      <div class="terminal-container">
        <div class="terminal-results">
          <div v-if="commandResults.length === 0" class="terminal-welcome">
            <div class="redis-logo">
              <pre>
   _____          _ _     
  |  __ \        | (_)    
  | |__) |___  __| |_ ___ 
  |  _  // _ \/ _` | / __|
  | | \ \  __/ (_| | \__ \
  |_|  \_\___|\__,_|_|___/
              </pre>
            </div>
            <p>欢迎使用 Artemis Redis CLI</p>
            <p>连接到: {{ currentConnection.name }} ({{ currentConnection.host }}:{{ currentConnection.port }})</p>
            <p>输入 'HELP' 获取帮助</p>
          </div>
          
          <div v-for="(item, index) in commandResults" :key="index" class="result-item">
            <div class="command-line">
              <span class="prompt">redis></span>
              <span class="command">{{ item.command }}</span>
              <span class="timestamp">{{ item.timestamp }}</span>
            </div>
            
            <div class="result-content" :class="`result-${item.result.type}`">
              <template v-if="item.result.type === 'string' || item.result.type === 'status' || item.result.type === 'nil' || item.result.type === 'error' || item.result.type === 'empty'">
                {{ item.result.value }}
              </template>
              
              <template v-else-if="item.result.type === 'array'">
                <div v-for="(line, i) in item.result.value" :key="i" class="array-item">
                  {{ i + 1 }}) "{{ line }}"
                </div>
              </template>
              
              <template v-else-if="item.result.type === 'hash'">
                <div v-for="(_, i) in Array(item.result.value.length / 2)" :key="i" class="hash-item">
                  {{ i + 1 }}) "{{ item.result.value[i*2] }}" => "{{ item.result.value[i*2+1] }}"
                </div>
              </template>
              
              <template v-else-if="item.result.type === 'multi' || item.result.type === 'help'">
                <div v-for="(line, i) in item.result.value" :key="i" class="multi-line">
                  {{ line }}
                </div>
              </template>
            </div>
          </div>
        </div>
        
        <div class="terminal-input">
          <span class="prompt">redis></span>
          <a-input
            id="command-input"
            v-model="commandInput"
            placeholder="输入Redis命令..."
            @press-enter="executeCommand"
            @keydown="handleKeyDown"
            :loading="loading"
            :disabled="loading"
            allow-clear
          >
            <template #suffix>
              <a-button type="text" @click="executeCommand" :disabled="loading">
                <template #icon><a-icon-send /></template>
              </a-button>
            </template>
          </a-input>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.redis-cli-container {
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
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.connection-bar {
  margin-bottom: 16px;
  padding: 16px;
  background-color: #2a2a2a;
  border-radius: 8px;
  border: 1px solid #3a3a3a;
}

.terminal-container {
  background-color: #1a1a1a;
  border-radius: 8px;
  border: 1px solid #3a3a3a;
  overflow: hidden;
  height: calc(100vh - 240px);
  min-height: 500px;
  display: flex;
  flex-direction: column;
}

.terminal-results {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column-reverse;
}

.terminal-welcome {
  color: #bbb;
  text-align: center;
  margin: 20px 0;
  
  .redis-logo {
    color: #ff4d4f;
    font-size: 0.8rem;
    margin-bottom: 16px;
    
    pre {
      font-family: monospace;
      line-height: 1.2;
    }
  }
  
  p {
    margin: 8px 0;
  }
}

.result-item {
  margin-bottom: 16px;
}

.command-line {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.prompt {
  color: #ff4d4f;
  font-weight: bold;
  margin-right: 8px;
  font-family: 'Courier New', monospace;
}

.command {
  color: #f5f5f5;
  font-family: 'Courier New', monospace;
}

.timestamp {
  margin-left: auto;
  color: #888;
  font-size: 0.8rem;
}

.result-content {
  padding: 8px 12px;
  margin-left: 24px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  background-color: #2a2a2a;
  color: #f5f5f5;
  overflow-x: auto;
}

.result-string, .result-status {
  color: #52c41a;
}

.result-nil, .result-empty {
  color: #bbb;
  font-style: italic;
}

.result-error {
  color: #ff4d4f;
}

.array-item, .hash-item, .multi-line {
  padding: 2px 0;
}

.terminal-input {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #2a2a2a;
  border-top: 1px solid #3a3a3a;
  
  .prompt {
    margin-right: 8px;
  }
  
  :deep(.arco-input-wrapper) {
    background-color: #1a1a1a;
    border-color: #3a3a3a;
    
    &:hover, &:focus {
      border-color: #ff4d4f;
    }
    
    .arco-input {
      color: #f5f5f5;
      background-color: transparent;
    }
    
    .arco-input-suffix {
      color: #888;
    }
  }
}

:deep(.arco-select-view) {
  background-color: #1a1a1a;
  border-color: #3a3a3a;
  color: #f5f5f5;
  
  &:hover {
    border-color: #ff4d4f;
  }
}
</style>