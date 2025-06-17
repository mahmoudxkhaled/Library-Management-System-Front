import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/core/models/ApiResult';
import { ITransaction, ITransactionDetails } from '../../models/ITransaction';
import { TransactionService } from '../../services/transaction.service';
import { TableLoadingService } from 'src/app/core/services/table-loading.service';
import { Table } from 'primeng/table';
import { SelectedFilter } from 'src/app/modules/admin/models/SelectedFilters';
import { BooksService } from 'src/app/modules/books/services/books.service';


export interface UpdateTransactionDto {
  id: string;
  returnDate?: Date;
  status?: string;
}
@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit, AfterViewChecked, OnDestroy {

  tableLoadingSpinner: boolean = true;
  subs: Subscription = new Subscription();

  //Issue book
  issueBookDialog: boolean = false;
  issueBookForm: FormGroup;
  //Return book
  returnBookDialog: boolean = false;
  returnBookForm: FormGroup;

  addTransactionDialog: boolean = false;
  transactionDetailsDialog: boolean = false;
  
  switchActivationTransactionDialog: boolean = false;

  submitted: boolean = false;

  transactions: ITransaction[] = [];
  selectedTransaction: ITransactionDetails | null = null;

  addTransactionForm: FormGroup;
  updateTransactionForm: FormGroup;

  loading: boolean = true;
  @ViewChild('filter') filter!: ElementRef;

  statuses: string[] = [];
  selectedFilters:SelectedFilter[]
  excelColumns:SelectedFilter[]=[{name:"Book"},{name:"User"},{name:"RequestDate"},{name:"IssueDate"},{name:"DueDate"},{name:"ReturnDate"},{name:"Status"},{name:"IssuedByUser"},{name:"ReturnedByUser"}]
  constructor(
    private BooksService:BooksService,
    private transactionServ: TransactionService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
    private tableLoadingService: TableLoadingService,
  ) {
    this.initTransactionModelAndForm();
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

  ngOnInit() {

    this.statuses = ["Pending","Issued","Returned","Overdue"];
    this.loadTransactions();

    this.tableLoadingService.loading$.subscribe((isLoading) => {
      this.tableLoadingSpinner = isLoading;
    });

  }

ExportToExcel()
{
  if(this.selectedFilters===undefined){
    this.messageService.add({
                    severity: 'error',
                    summary: 'Export Requirements',
                    detail: 'Please select at least one filter from the dropdown before exporting to Excel.',
                    life: 3000,
                  });
                  return;
  }
   this.transactionServ.ExportToExcel(this.selectedFilters).subscribe(res=>{
    this.BooksService.downLoadFile(res,"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "TransactionRecords.xlsx");
  },err=>{
 this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed Export to Excel'
          });
     }
  )
}
  loadTransactions() {
    this.tableLoadingService.show();
    this.loading = true;
    this.subs.add(
      this.transactionServ.getAllTransactions().subscribe((data) => {
        this.transactions = data.data.map(transaction => ({
          ...transaction,
          requestDate: transaction.requestDate? new Date(transaction.requestDate) : null,
          issueDate: transaction.issueDate? new Date(transaction.issueDate): null,
          dueDate:  transaction.dueDate? new Date(transaction.dueDate): null,
          returnDate: transaction.returnDate? new Date(transaction.returnDate) : null
        }));
        this.ref.detectChanges();
        this.tableLoadingService.hide();
        this.loading = false;
      })
    );
  }

  //#region Add Transaction
  addTransaction() {
    this.initTransactionModelAndForm();
    this.addTransactionDialog = true;
  }

  saveAddTransaction() {
    this.submitted = true;

    if (this.addTransactionForm.valid) {
      const request = this.addTransactionForm.value;

      this.subs.add(
        this.transactionServ.addTransaction(request).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Transaction Added',
              life: 3000,
            });
            this.loadTransactions();
            this.ref.detectChanges();
            this.initTransactionModelAndForm();
            this.addTransactionDialog = false;
          },
        })
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Fill all fields please',
        life: 3000,
      });
    }
  }

  declineAddTransactionDialog() {
    this.submitted = false;
    this.initTransactionModelAndForm();
    this.addTransactionDialog = false;
  }
  //#endregion


  initTransactionModelAndForm() {
    this.addTransactionForm = this.formBuilder.group({
      userId: ['', Validators.required],
      bookId: ['', Validators.required],
      issueDate: [new Date().toISOString().split('T')[0]],
      dueDate: [new Date().toISOString().split('T')[0]],
      returnDate: [null],
      status: ['Issued', Validators.required],
      isActive: [true],
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
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


  hideIssueBookDialog() {
    this.issueBookDialog = false;
    this.submitted = false;
  }
  issueBook(transactionId: string) {
    this.submitted = false;
    this.issueBookDialog = true;
    this.issueBookForm = this.formBuilder.group({
      transactionId: [transactionId, Validators.required],
      issueDate: [null, Validators.required]
    });
  }
  confirmIssueBook() {
    this.submitted = true;
    if (this.issueBookForm.valid){
      this.transactionServ.issueBook(this.issueBookForm.value).subscribe({
            next: (res) => {
                if (res.isSuccess) {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: res.message
                  });
                  this.hideIssueBookDialog();
                  this.loadTransactions();
                } else {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: res.message || 'Failed to submit issueing book'
                  });
                }
        },
        error: (error) => {
          console.error('Error submitting Issueing Book:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message? error.error.message: 'Failed to submit issueing book'
          });
        }
      })
    }
  }


  hideReturnBookDialog() {
    this.returnBookDialog = false;
    this.submitted = false;
  }
  returnBook(transactionId: string) {
    this.submitted = false;
    this.returnBookDialog = true;
    this.returnBookForm = this.formBuilder.group({
      transactionId: [transactionId, Validators.required],
      returnDate: [null, Validators.required],
      notes: [null]
    });
  }
  confirmReturnBook() {
    this.submitted = true;
    if (this.returnBookForm.valid){
      this.transactionServ.returnBook(this.returnBookForm.value).subscribe({
            next: (res) => {
                if (res.isSuccess) {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: res.message
                  });
                  this.hideReturnBookDialog();
                  this.loadTransactions();
                } else {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: res.message || 'Failed to submit Returning book'
                  });
                }
        },
        error: (error) => {
          console.error('Error submitting Returning Book:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message? error.error.message: 'Failed to submit Returning book'
          });
        }
      });
    }
  }

  hideDetailsBookDialog() {
    this.transactionDetailsDialog = false;
  }
  getDetails(transactionId: string){
    this.transactionServ.getTransactionById(transactionId).subscribe({
            next: (res) => {
                if (res.isSuccess) {
                  this.selectedTransaction = res.data;
                  this.transactionDetailsDialog = true;
                  //show details dialog
                } else {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: res.message || 'Failed to get transaction details'
                  });
                }
        },
        error: (error) => {
          console.error('Error getting transaction details:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message? error.error.message: 'Failed to get transaction details'
          });
        }
      })
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
      table.clear();
      this.filter.nativeElement.value = '';
  }
}