import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrendingBookListComponent } from './components/trending-book-list/trending-book-list.component';

const routes: Routes = [
  { path: '', component: TrendingBookListComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrendingBooksRoutingModule { }
