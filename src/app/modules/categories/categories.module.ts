import { NgModule } from '@angular/core';
import { CategoriesRoutingModule } from './categories-routing.module';
import { SharedModule } from 'primeng/api';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { LMSSharedModule } from 'src/app/shared/lms-shared.module';


@NgModule({
  declarations: [CategoryListComponent],
  imports: [
    LMSSharedModule,
    CategoriesRoutingModule
  ]
})
export class CategoriesModule { }
