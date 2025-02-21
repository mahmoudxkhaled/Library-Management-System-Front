import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


const components = [

];

const imports = [
  FormsModule,
  CommonModule,
  RouterModule,
  ReactiveFormsModule,

];

const providers = [];

@NgModule({
  declarations: [...components],
  imports: [...imports],
  exports: [...imports, ...components],
  providers: [...providers],
})
export class LMSSharedModule { }