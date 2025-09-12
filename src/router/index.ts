import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/pages/HomePage.vue'
import LoginPage from '../components/pages/LoginPage.vue'
import MaterialUnitsPage from '../components/pages/MaterialUnitsPage.vue'
import MaterialTypesPage from '../components/pages/MaterialTypesPage.vue'
import MaterialPropertiesPage from '../components/pages/MaterialPropertiesPage.vue'
import MaterialBrandsPage from '../components/pages/MaterialBrandsPage.vue'
import TestPage from '@/components/pages/TestPage.vue'
import WarehousesPage from '@/components/pages/WarehousesPage.vue'

const routes = [
  {
    path: '/test',
    name: 'test',
    component: TestPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/library/materials/units',
    name: 'library-materials-units',
    component: MaterialUnitsPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/library/materials/types',
    name: 'library-materials-types',
    component: MaterialTypesPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/library/materials/properties',
    name: 'library-materials-properties',
    component: MaterialPropertiesPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/library/materials/brands',
    name: 'library-materials-brands',
    component: MaterialBrandsPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/library/materials/warehouses',
    name: 'library-materials-warehouses',
    component: WarehousesPage,
    meta: {
      requiresAuth: true
    }
  } ,
  {
    path: '/accounting/materials',
    name: 'accounting-materials',
    component: () => import('@/components/pages/MaterialsPage.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'accounting-materials-list',
        component: () => import('@/components/pages/MaterialsListPage.vue'),
      },
      {
        path: '/accounting/materials/moving/:type',
        name: 'accounting-materials-moving',
        component: () => import('@/components/pages/accounting/materials/operations/moving/MaterialMovePage.vue'),
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  }
});

router.beforeEach((to, from, next) => {

  if (to.matched.some(record => record.meta.requiresAuth)) {
    // При cookie-based auth лучше проверять сервером/стором. Простая заглушка:
    // next() пропускает, сервер вернет 401 и редирект произойдет в axios interceptor
  } else if (to.path === '/login') {
    // Если уже авторизован, можно редиректить на главную по стору/пинг-запросу
  }

  next();
}); 

export default router
