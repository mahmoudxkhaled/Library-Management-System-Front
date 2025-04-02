import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthorsRoutingModule } from './authors-routing.module';
import { LMSSharedModule } from 'src/app/shared/lms-shared.module';
import { AuthorsListComponent } from './Components/authors-list/authors-list.component';


@NgModule({
  declarations: [
    AuthorsListComponent
  ],
  imports: [
    CommonModule,
    AuthorsRoutingModule,
    LMSSharedModule,
  ]
})
export class AuthorsModule { }
