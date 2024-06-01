import { Routes } from '@angular/router';
import { AssignmentPageComponent } from './pages/assignment-page/assignment-page.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { ProductsPageComponent } from './pages/products-page/products-page.component';
import { TestPageComponent } from './pages/test-page/test-page.component';
import { ReportPageComponent } from './pages/report-page/report-page.component'

export const routes: Routes = [
    { path: '', redirectTo: '/assignment', pathMatch: 'full' },
    { path: 'assignment', component: AssignmentPageComponent },
    { path: 'test', component: TestPageComponent },
    { path: 'users', component: UsersPageComponent },
    { path: 'products', component: ProductsPageComponent },
    { path: 'report', component: ReportPageComponent }
];
