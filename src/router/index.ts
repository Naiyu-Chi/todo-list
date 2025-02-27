import { createWebHistory, createRouter } from 'vue-router';

import TodoView from '@/views/todo/index.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        // add another route for dashboard or login pages
        {
            path: '/',
            name: 'Todo',
            component: TodoView
        }
    ]
})

export default router;