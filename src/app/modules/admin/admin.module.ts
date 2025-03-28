import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { LMSSharedModule } from 'src/app/shared/lms-shared.module';
import { BookListComponent } from './components/book-list/book-list.component';


@NgModule({
  declarations: [
    BookListComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    LMSSharedModule,   
  ]
})
export class AdminModule { }
