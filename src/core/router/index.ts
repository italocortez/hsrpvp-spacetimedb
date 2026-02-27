import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: () => import('../../modules/landing/views/home_page.vue'),
    },
    {
        path: '/lobby',
        name: 'lobby',
        component: () => import('../../modules/lobby/views/lobby_room.vue'),
    },
    {
        path: '/library',
        name: 'library',
        component: () => import('../../modules/library/views/cost_tables.vue'),
    },
    {
        path: '/builder',
        name: 'builder',
        component: () => import('../../modules/builder/views/sandbox.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
