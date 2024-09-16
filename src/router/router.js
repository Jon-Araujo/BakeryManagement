import { createRouter, createWebHashHistory } from "vue-router";
import HomeScreen from "@/views/HomeScreen.vue";
import CashRegisterScreen from "@/views/CashRegisterScreen.vue";
import SalesControlScreen from "@/views/SalesControlScreen.vue";
import VerifyAcessScreen from "@/views/VerifyAcessScreen.vue";

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
    {
        path: '/verify-acess',
        name: "VerifyAcess",
        component: VerifyAcessScreen
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes: routesList
});

export default router;