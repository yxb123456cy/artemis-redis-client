import {createRouter, createWebHistory, type RouteRecordRaw,} from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: {title: '首页'}
    },
    {
        path: '/connections',
        name: 'Connections',
        component: () => import('../views/Connections.vue'),
        meta: {title: 'Redis连接管理'}
    },
    {
        path: '/data-management',
        name: 'DataManagement',
        component: () => import('../views/DataManagement.vue'),
        meta: {title: 'Redis数据管理'}
    },
    {
        path: '/redis-cli',
        name: 'RedisCli',
        component: () => import('../views/RedisCli.vue'),
        meta: {title: 'Redis命令行'}
    },
    {
        path: '/user-center',
        name: 'UserCenter',
        component: () => import('../views/UserCenter.vue'),
        meta: {title: '个人中心'}
    },
    {
        path: '/settings',
        name: 'Settings',
        component: () => import('../views/Settings.vue'),
        meta: {title: '系统设置'}
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;