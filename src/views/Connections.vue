<script setup lang="ts">
import {ref, reactive} from 'vue';
import {Message} from '@arco-design/web-vue';
import type {RedisConnection} from "../models";
import {useConfirmLoadingStore} from "../store/confirmLoading.ts";

/**
 * useConfirmLoadingStore
 */
const confirmLoadingStore = useConfirmLoadingStore();
/**
 * 模拟数据
 */
const connections = ref<RedisConnection[]>([
  {
    id: '1',
    name: '本地Redis',
    host: 'localhost',
    port: 6379,
    db: 0,
    description: '本地开发环境Redis服务器',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    id: '2',
    name: '测试服务器',
    host: '192.168.1.100',
    port: 6379,
    password: '********',
    db: 1,
    description: '测试环境Redis服务器',
    createdAt: new Date('2023-01-02'),
    updatedAt: new Date('2023-01-02')
  },
  {
    id: '3',
    name: '生产服务器',
    host: 'redis.example.com',
    port: 6380,
    username: 'admin',
    password: '********',
    db: 0,
    description: '生产环境Redis服务器',
    createdAt: new Date('2023-01-03'),
    updatedAt: new Date('2023-01-03')
  }
]);

/**
 * 新增连接的弹窗可见性
 */
const visible = ref<boolean>(false);

/**
 * 表单名称
 */
const formTitle = ref<string>('添加Redis连接');
/**
 * 是否编辑
 */
const isEdit = ref<boolean>(false);


/**表单模型
 * Partial将某个接口中的所有属性变为可选的
 */
const formModel = reactive<Partial<RedisConnection>>({
  name: '',
  host: '',
  port: 6379,
  password: '',
  username: '',
  db: 0,
  description: ''
});
/**
 * 表单校验规则;
 */
const formRules = {
  name: [
    {required: true, message: '请输入连接名称'}
  ],
  host: [
    {required: true, message: '请输入主机地址'}
  ],
  port: [
    {required: true, message: '请输入端口号'},
    {type: 'number', min: 1, max: 65535, message: '端口号必须在1-65535之间'}
  ]
};
/**
 * 重置表单输入 不采用ref调用方式;
 */
const resetForm = () => {
  formModel.id = undefined;
  formModel.name = '';
  formModel.host = '';
  formModel.port = 6379;
  formModel.password = '';
  formModel.username = '';
  formModel.db = 0;
  formModel.description = '';
};
/**
 * 打开弹窗;
 */
const handleAdd = () => {
  formTitle.value = '添加Redis连接';
  isEdit.value = false;
  resetForm();
  visible.value = true;
};
/**
 * 打开弹窗;
 * @param record
 */
const handleEdit = (record: RedisConnection) => {
  formTitle.value = '编辑Redis连接';
  isEdit.value = true;
  Object.assign(formModel, record);
  visible.value = true;
};
/**
 * 处理删除Redis连接逻辑;
 * @param record type-RedisConnection
 */
const handleDelete = (record: RedisConnection) => {
  connections.value = connections.value.filter(item => item.id !== record.id);
  Message.success('删除成功');
};
/**
 * 处理Redis连接测试逻辑;
 * @param record type-RedisConnection
 */
const handleTest = (record: RedisConnection) => {
  console.log(record);
  // 模拟测试连接
  Message.loading('正在测试连接...');
  setTimeout(() => {
    Message.success('连接测试成功');
  }, 1000);
};
/**
 * 处理（新增、修改）Redis连接表单提交;
 */
const handleSubmit = () => {

  confirmLoadingStore.setLoadingState(true);
  setTimeout(() => {
    if (isEdit.value) {
      // 编辑现有连接
      const index = connections.value.findIndex(item => item.id === formModel.id);
      if (index !== -1) {
        const updatedConnection = {
          ...connections.value[index],
          ...formModel,
          updatedAt: new Date()
        };
        connections.value[index] = updatedConnection as RedisConnection;
        Message.success('更新成功');
      }
    } else {
      // 添加新连接
      const newConnection: RedisConnection = {
        id: Date.now().toString(),
        name: formModel.name!,
        host: formModel.host!,
        port: formModel.port!,
        password: formModel.password,
        username: formModel.username,
        db: formModel.db,
        description: formModel.description,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      connections.value.push(newConnection);
      Message.success('添加成功');
    }
    visible.value = false;
    resetForm();
    confirmLoadingStore.setLoadingState(false);
  }, 500);

};
/**
 * 取消新增、修改Redis连接弹窗;
 */
const handleCancel = () => {
  visible.value = false; //关闭弹窗;
  resetForm(); //重置表单;
};
</script>

<template>
  <div class="connections-container">
    <div class="page-header">
      <h1 class="page-title">Redis连接管理</h1>
      <a-button type="primary" @click="handleAdd">
        <template #icon>
          <icon-plus/>
        </template>
        添加连接
      </a-button>
    </div>

    <a-card class="connection-list-card">
      <template #title>
        <div class="card-title">
          <icon-link/>
          Redis连接列表
        </div>
      </template>

      <a-table :data="connections" :pagination="false" :bordered="false">
        <template #columns>
          <a-table-column title="连接名称" data-index="name">
            <template #cell="{ record }">
              <div class="connection-name">
                <icon-link/>
                <span>{{ record.name }}</span>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="主机地址" data-index="host"/>
          <a-table-column title="端口" data-index="port"/>
          <a-table-column title="数据库" data-index="db">
            <template #cell="{ record }">
              {{ record.db !== undefined ? record.db : '-' }}
            </template>
          </a-table-column>
          <a-table-column title="描述" data-index="description">
            <template #cell="{ record }">
              {{ record.description || '-' }}
            </template>
          </a-table-column>
          <a-table-column title="操作">
            <template #cell="{ record }">
              <div class="operations">
                <a-button type="text" size="small" @click="handleTest(record)">
                  <template #icon>
                    <icon-check-circle/>
                  </template>
                  测试
                </a-button>
                <a-button type="text" size="small" @click="handleEdit(record)">
                  <template #icon>
                    <icon-edit/>
                  </template>
                  编辑
                </a-button>
                <a-popconfirm
                    content="确定要删除此连接吗？"
                    @ok="handleDelete(record)"
                >
                  <a-button type="text" size="small" status="danger">
                    <template #icon>
                      <icon-delete/>
                    </template>
                    删除
                  </a-button>
                </a-popconfirm>
              </div>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>

    <!--    新建、编辑Redis连接弹窗-->
    <a-modal
        v-if="visible"
        v-model:visible="visible"
        :title="formTitle"
        @cancel="handleCancel"
        @before-ok="handleSubmit"
        :ok-loading="confirmLoadingStore.getLoadingState"
    >
      <a-form :model="formModel" :rules="formRules" layout="horizontal" size="small">
        <a-form-item field="name" label="连接名称">
          <a-input v-model="formModel.name" placeholder="请输入连接名称" allow-clear/>
        </a-form-item>
        <a-form-item field="host" label="主机地址">
          <a-input v-model="formModel.host" placeholder="请输入主机地址" allow-clear/>
        </a-form-item>
        <a-form-item field="port" label="端口">
          <a-input-number v-model="formModel.port" placeholder="请输入端口号" :min="1" :max="65535"
                          style="width: 100%"/>
        </a-form-item>
        <a-form-item field="username" label="用户名 (可选)">
          <a-input v-model="formModel.username" placeholder="请输入用户名" allow-clear/>
        </a-form-item>
        <a-form-item field="password" label="密码 (可选)">
          <a-input-password v-model="formModel.password" placeholder="请输入密码" allow-clear/>
        </a-form-item>
        <a-form-item field="db" label="数据库 (可选)">
          <a-input-number v-model="formModel.db" placeholder="请输入数据库" :min="0" :max="15" style="width: 100%"/>
        </a-form-item>
        <a-form-item field="description" label="描述 (可选)">
          <a-textarea v-model="formModel.description" placeholder="请输入描述信息" allow-clear/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
.connections-container {
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

.connection-list-card {
  background-color: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;

  :deep(.arco-card-header) {
    border-bottom: 1px solid #3a3a3a;
  }
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #f5f5f5;
  font-weight: 600;
  font-size: 1.1rem;
}

.connection-name {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ff4d4f;
  font-weight: 500;
}

.operations {
  display: flex;
  gap: 8px;
}

:deep(.arco-table) {
  background-color: transparent;
  color: #f5f5f5;
}

:deep(.arco-table-th) {
  background-color: #1a1a1a !important;
  color: #f5f5f5 !important;
  border-color: #3a3a3a !important;
}

:deep(.arco-table-td) {
  background-color: transparent;
  color: #f5f5f5;
  border-color: #3a3a3a !important;
}

:deep(.arco-table-tr:hover .arco-table-td) {
  background-color: #1a1a1a !important;
}

:deep(.arco-table-stripe .arco-table-tr:nth-child(even) .arco-table-td) {
  background-color: #222;
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
  color: #A1151E;
}

:deep(.arco-modal-footer) {
  border-top: 1px solid #3a3a3a;
}

:deep(.arco-form-item-label) {
  color: #A1151E;
}


</style>