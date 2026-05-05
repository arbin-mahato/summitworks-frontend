import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./features/auth/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'hotels',
        loadComponent: () => import('./features/hotels/hotel-list/hotel-list.component').then(m => m.HotelListComponent)
      },
      {
        path: 'hotels/confirmation',
        loadComponent: () => import('./features/hotels/booking-confirmation/booking-confirmation.component').then(m => m.BookingConfirmationComponent)
      },
      {
        path: 'hotels/:id',
        loadComponent: () => import('./features/hotels/hotel-detail/hotel-detail.component').then(m => m.HotelDetailComponent)
      },
      {
        path: 'bookings',
        loadComponent: () => import('./features/bookings/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent)
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        children: [
          {
            path: 'dashboard',
            loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
          },
          {
            path: 'bookings',
            loadComponent: () => import('./features/admin/booking-management/booking-management.component').then(m => m.BookingManagementComponent)
          },
          {
            path: 'hotels',
            loadComponent: () => import('./features/admin/hotel-management/hotel-management.component').then(m => m.HotelManagementComponent)
          },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
      },
      { path: '', redirectTo: 'hotels', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'app/hotels', pathMatch: 'full' },
  { path: '**', redirectTo: 'app/hotels' }
];
