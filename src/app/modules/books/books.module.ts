import { NgModule } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { BooksRoutingModule } from './books-routing.module';
import { BookListComponent } from './components/book-list/book-list.component';
import { LMSSharedModule } from 'src/app/shared/lms-shared.module';


@NgModule({
  declarations: [BookListComponent],
  imports: [
    LMSSharedModule,
    BooksRoutingModule
  ]
})
export class BooksModule { }
