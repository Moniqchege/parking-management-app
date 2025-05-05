import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { AdminComponent } from './components/admin/admin.component';
import { roleGuard } from './core/guards/role.guard';
import { ClientPortalComponent } from './components/client-portal/client-portal.component';
import { EntryGateComponent } from './components/entry-gate/entry-gate.component';
import { ExitGateComponent } from './components/exit-gate/exit-gate.component';
import { LandingComponent } from './components/landing/landing.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/landing',
        pathMatch: 'full'
    },
    {
      path: 'landing',
      component: LandingComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent, 
        canActivate: [authGuard]
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['super-admin']}
    },
    { 
        path: 'client', 
        component: ClientPortalComponent, 
        canActivate: [authGuard, roleGuard],
        data: { roles: ['client', 'super-admin'] }
      },
      { 
        path: 'entry', 
        component: EntryGateComponent, 
        canActivate: [authGuard, roleGuard],
        data: { roles: ['entry-operator'] }
      },
      { 
        path: 'exit', 
        component: ExitGateComponent, 
        canActivate: [authGuard, roleGuard],
        data: { roles: ['exit-operator'] }
      },
      {
        path: '**',
        redirectTo: '/login'
      }
];
