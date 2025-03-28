import { NgModule } from '@angular/core';

import { UsersRoutingModule } from './users-routing.module';
import { LMSSharedModule } from 'src/app/shared/lms-shared.module';
import { UserListComponent } from './components/user-list/user-list.component';


@NgModule({
  declarations: [UserListComponent],
  imports: [
    LMSSharedModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
