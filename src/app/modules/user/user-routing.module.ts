import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserTransactionsListComponent } from './components/user-transactions-list/user-transactions-list.component';

const routes: Routes = [
  {path:'',component:UserProfileComponent},
  {path:'profile',component:UserProfileComponent},
  {path:'transactions', component: UserTransactionsListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
