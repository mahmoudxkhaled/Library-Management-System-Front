import { NgModule } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { BooksRoutingModule } from './books-routing.module';
import { BookListComponent } from './components/book-list/book-list.component';


@NgModule({
  declarations: [BookListComponent],
  imports: [
    SharedModule,
    BooksRoutingModule
  ]
})
export class BooksModule { }
