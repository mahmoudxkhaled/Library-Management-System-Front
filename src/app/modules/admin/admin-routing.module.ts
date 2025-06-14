import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { CategoryListComponent } from './components/categories/components/category-list/category-list.component';
import { FeedbackListComponent } from './components/feedbacks/components/feedback-list/feedback-list.component';
import { TransactionListComponent } from './components/transactions/components/transaction-list/transaction-list.component';
import { TrendingBookListComponent } from './components/trending-books/components/trending-book-list/trending-book-list.component';

const routes: Routes = [
    { path: 'Books', component: BookListComponent },
    { path: 'dashboard', loadChildren: () => import('src/app/modules/admin/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
    { path: 'categories',loadChildren: () => import('src/app/modules/admin/components/categories/categories.module').then(m => m.CategoriesModule) },
    { path: 'feedbacks',loadChildren: () => import('src/app/modules/admin/components/feedbacks/feedbacks.module').then(m => m.FeedbacksModule)  },
    { path: 'transactions',loadChildren: () => import('src/app/modules/admin/components/transactions/transactions.module').then(m => m.TransactionsModule) },
    { path: 'trending-books', loadChildren: () => import('src/app/modules/admin/components/trending-books/trending-books.module').then(m => m.TrendingBooksModule)  },
    { path: 'users',loadChildren: () => import('src/app/modules/admin/components/users/users.module').then(m => m.UsersModule)  },
    { path: 'authors',loadChildren: () => import('src/app/modules/admin/components/authors/authors.module').then(m =>m.AuthorsModule)}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
