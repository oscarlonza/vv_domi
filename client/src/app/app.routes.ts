import { Routes } from '@angular/router';
//import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./modules/login/login.component')
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./modules/dashboard/dashboard.component'),
        children: [
            {
                path: 'product',
                loadComponent: () => import('./modules/admin/products/products.component')
            },
            {
                path: 'order',
                loadComponent: () => import('./modules/admin/orders/orders.component')
            },
            {
                path: 'report',
                loadComponent: () => import('./modules/admin/report/report.component')
            },
            {
                path: '**',
                redirectTo: 'report',
            }
        ]
    },
    {
        path: 'store',
        loadComponent: () => import('./modules/store/store.component'),
        children: [
            {
                path: 'home',
                loadComponent: () => import('./modules/home/home.component')
            }
        ]
    },
    {
        path: 'signup',
        loadComponent: () => import('./modules/signup/signup.component')
    },
    {
        path: '**',
        redirectTo: 'store/home'
    }
];
