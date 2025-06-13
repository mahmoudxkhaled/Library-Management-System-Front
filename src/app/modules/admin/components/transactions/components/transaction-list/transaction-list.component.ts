import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/core/models/ApiResult';
import { ITransaction } from '../../models/ITransaction';
import { TransactionService } from '../../services/transaction.service';
import { TableLoadingService } from 'src/app/core/services/table-loading.service';


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
  updateTransactionDialog: boolean = false;
  deletionTransactionDialog: boolean = false;
  
  switchActivationTransactionDialog: boolean = false;

  submitted: boolean = false;

  transactions: ITransaction[] = [];
  selectedTransaction: ITransaction | null = null;

  addTransactionForm: FormGroup;
  updateTransactionForm: FormGroup;


  constructor(
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
    this.loadTransactions();

    this.tableLoadingService.loading$.subscribe((isLoading) => {
      this.tableLoadingSpinner = isLoading;
    });

  }

  assignCurrentSelect(transaction: ITransaction) {
    this.selectedTransaction = transaction;
  }

  loadTransactions() {
    this.tableLoadingService.show();
    this.subs.add(
      this.transactionServ.getAllTransactions().subscribe((data) => {
        this.transactions = data.data;
        this.ref.detectChanges();
        this.tableLoadingService.hide();
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

  //#region Update Transaction
  openUpdateTransactionDialog(transaction: ITransaction) {
    this.selectedTransaction = transaction;
    this.updateTransactionForm = this.formBuilder.group({
      id: [transaction.id],
      returnDate: [transaction.returnDate],
      status: [transaction.status, Validators.required],
    });
    this.updateTransactionDialog = true;
  }

  saveUpdateTransaction() {
    this.submitted = true;

    if (this.updateTransactionForm.valid) {
      const request = this.updateTransactionForm.value;

      this.subs.add(
        this.transactionServ.updateTransaction(request).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Transaction Updated',
              life: 3000,
            });
            this.loadTransactions();
            this.ref.detectChanges();
            this.updateTransactionDialog = false;
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

  declineUpdateTransactionDialog() {
    this.submitted = false;
    this.updateTransactionDialog = false;
  }
  //#endregion

  //#region Deletion
  deleteTransaction(transaction: ITransaction) {
    this.deletionTransactionDialog = true;
    this.selectedTransaction = { ...transaction };
  }

  confirmDeletion() {
    this.deletionTransactionDialog = false;
    this.subs.add(
      this.transactionServ.deleteTransaction(this.selectedTransaction!.id).subscribe({
        next: (response: ApiResult) => {
          if (response.code !== 406) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successfully',
              detail: response.message,
              life: 3000,
            });
            this.loadTransactions();
            this.ref.detectChanges();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Cannot delete transaction',
              life: 5000,
            });
            this.loadTransactions();
            this.ref.detectChanges();
          }
        },
      })
    );
    this.initTransactionModelAndForm();
    this.deletionTransactionDialog = false;
  }

  declineDeletion() {
    this.deletionTransactionDialog = false;
    this.initTransactionModelAndForm();
  }
  //#endregion

  initTransactionModelAndForm() {
    this.selectedTransaction = {
      id: '',
      userId: '',
      bookId: '',
      issueDate: new Date(),
      dueDate: new Date(),
      returnDate: undefined,
      status: 'Issued',
      isActive: false,
      userFullName:'',
      bookName:''
    };

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
      })
    }
  }
}