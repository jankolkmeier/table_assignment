import { Routes } from '@angular/router';
import { AssignmentPageComponent } from './pages/assignment-page/assignment-page.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { ProductsPageComponent } from './pages/products-page/products-page.component';

export const routes: Routes = [
    { path: '', redirectTo: '/assignment', pathMatch: 'full' },
    { path: 'assignment', component: AssignmentPageComponent },
    { path: 'users', component: UsersPageComponent },
    { path: 'products', component: ProductsPageComponent }
];
