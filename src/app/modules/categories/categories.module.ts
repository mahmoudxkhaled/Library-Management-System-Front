import { NgModule } from '@angular/core';
import { CategoriesRoutingModule } from './categories-routing.module';
import { SharedModule } from 'primeng/api';
import { CategoryListComponent } from './components/category-list/category-list.component';


@NgModule({
  declarations: [CategoryListComponent],
  imports: [
    SharedModule,
    CategoriesRoutingModule
  ]
})
export class CategoriesModule { }
