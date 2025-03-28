import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrendingBooksRoutingModule } from './trending-books-routing.module';
import { TrendingBookListComponent } from './components/trending-book-list/trending-book-list.component';
import { LMSSharedModule } from 'src/app/shared/lms-shared.module';


@NgModule({
  declarations: [TrendingBookListComponent],
  imports: [
    LMSSharedModule,
    TrendingBooksRoutingModule
  ]
})
export class TrendingBooksModule { }
