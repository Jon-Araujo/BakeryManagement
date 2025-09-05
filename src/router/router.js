import { createRouter, createWebHashHistory } from "vue-router";
import HomeScreen from "@/views/HomeScreen.vue";
import CashRegisterScreen from "@/views/CashRegisterScreen.vue";
import SalesControlScreen from "@/views/SalesControlScreen.vue";
import VerifyAcessScreen from "@/views/VerifyAcessScreen.vue";

function isAuthenticated() {
    return localStorage.getItem('authToken');
  }

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
        component: SalesControlScreen,
        meta: { requiresAuth: true }
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

// Guard global de rota
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (localStorage.getItem('authToken') === "true") {
          next();
      } 
    } else {
      next();
    }
  });

export default router;