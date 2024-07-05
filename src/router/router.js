import { createRouter, createWebHashHistory } from "vue-router";
import HomeScreen from "@/views/HomeScreen.vue";
import CashRegisterScreen from "@/views/CashRegisterScreen.vue";
import SalesControlScreen from "@/views/SalesControlScreen.vue";

const routesList = [
    {
        path: '/',
        name: "HomeScreen",
        component: HomeScreen
    },
    {
        path: '/cash-register',
        name: "CashRegister",
        component: CashRegisterScreen
    },
    {
        path: '/sales-control',
        name: "SalesControl",
        component: SalesControlScreen
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes: routesList
});

export default router;