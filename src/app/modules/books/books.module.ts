import { NgModule } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { BooksRoutingModule } from './books-routing.module';
import { BooksListComponent } from 'src/app/modules/books/components/books-list/books-list.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { RouterLink } from '@angular/router';
import { LMSSharedModule } from 'src/app/shared/lms-shared.module';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
  declarations: [
    BooksListComponent,
    BookDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BooksRoutingModule,
    PaginatorModule,
    TooltipModule,
    RouterLink,
    LMSSharedModule,
    ButtonModule,
    RatingModule,
    ToastModule,
    ProgressSpinnerModule
  ]
})
export class BooksModule { }
