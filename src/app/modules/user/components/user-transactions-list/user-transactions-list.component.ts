import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserTransactionDto } from '../../models/UserTransactionDto';
import { UserProfileService } from '../../services/user-profile.service';
import { ApiResult } from 'src/app/core/models/ApiResult';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-user-transactions-list',
  templateUrl: './user-transactions-list.component.html',
  styleUrl: './user-transactions-list.component.scss'
})
export class UserTransactionsListComponent implements OnInit {
  transactions: UserTransactionDto[] = [];
  loading: boolean = true;
  @ViewChild('filter') filter!: ElementRef;

  constructor(private userService: UserProfileService) { }

  ngOnInit(): void {
      this.loadTransactions();
    }
  
    loadTransactions(): void {
      this.loading = true;
      this.userService.getUserTransactionss().subscribe({
        next: (response: ApiResult) => {
          if (response.isSuccess) {
            this.transactions = response.data;
            console.log("this.transactions ==> ",this.transactions)
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading transactions', error);
          this.loading = false;
        }
      });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    getTransactionStatusBadge(status: string){
      var badge = '';
      switch(status) { 
        case "Issued": { 
            badge = 'qualified'
            break; 
        } 
        case "Returned": { 
            badge = 'proposal';
            break; 
        } 
        case "Overdue": { 
            badge = 'unqualified';
            break; 
        } 
        default: { 
            badge = 'renewal';
            break; 
        } 
      } 
      return badge;
    }
}
