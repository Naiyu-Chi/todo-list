import { createWebHistory, createRouter } from 'vue-router';

import TodoView from '@/views/todo/index.vue';
import DashboardView from '@/views/dashboard/index.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Todo',
            component: TodoView,
        },
        {
            path: "/dashboard",
            component: DashboardView
        }
    ]
})

export default router;