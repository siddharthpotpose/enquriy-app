import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { SubmitEnquiry } from './pages/submit-enquiry/submit-enquiry';
import { Dashboard } from './pages/dashboard/dashboard';
import { EquiryDetails } from './pages/equiry-details/equiry-details';
import { authGuardGuard } from '../auth/auth-guard-guard';
import { EnquiryCategory } from './pages/enquiry-category/enquiry-category';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: Home,
       
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'submitenquiry',
        component: SubmitEnquiry,
    },
    {
        path: 'enquirydetails',
        component: EquiryDetails,
        canActivate: [authGuardGuard]
    },
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuardGuard]
    },
    {
        path: 'category',
        component: EnquiryCategory,
        canActivate: [authGuardGuard]
    }
];
