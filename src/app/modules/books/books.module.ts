import { NgModule } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { BooksRoutingModule } from './books-routing.module';
import { BooksListComponent } from 'src/app/modules/books/components/books-list/books-list.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { RouterLink } from '@angular/router';


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
    RouterLink
  ]
})
export class BooksModule { }
