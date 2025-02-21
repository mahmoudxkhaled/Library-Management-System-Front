import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrendingBooksRoutingModule } from './trending-books-routing.module';
import { TrendingBookListComponent } from './components/trending-book-list/trending-book-list.component';
import { SharedModule } from 'primeng/api';


@NgModule({
  declarations: [TrendingBookListComponent],
  imports: [
    SharedModule,
    TrendingBooksRoutingModule
  ]
})
export class TrendingBooksModule { }
