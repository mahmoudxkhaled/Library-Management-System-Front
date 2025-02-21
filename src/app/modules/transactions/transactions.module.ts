import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionsRoutingModule } from './transactions-routing.module';
import { LMSSharedModule } from 'src/app/shared/lms-shared.module';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';


@NgModule({
  declarations: [TransactionListComponent],
  imports: [
    LMSSharedModule,
    TransactionsRoutingModule
  ]
})
export class TransactionsModule { }
