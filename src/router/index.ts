import { createWebHistory, createRouter } from 'vue-router';

import TodoView from '@/views/todo/index.vue';
import DashboardView from '@/views/dashboard/index.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Todo',
            component: TodoView,
            meta: { title: '首頁', link: '/' }
        },
        {
            path: "/dashboard",
            component: DashboardView,
            meta: { title: '儀表板', link: '/dashboard' }
        }
    ]
})

export default router;