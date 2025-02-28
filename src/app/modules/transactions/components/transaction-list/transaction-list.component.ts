import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/core/models/ApiResult';
import { ITransaction } from '../../models/ITransaction';
import { TransactionService } from '../../services/transaction.service';
import { TableLoadingService } from 'src/app/core/Services/table-loading.service';


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

  addTransactionDialog: boolean = false;
  updateTransactionDialog: boolean = false; // New dialog for updating
  deletionTransactionDialog: boolean = false;
  switchActivationTransactionDialog: boolean = false;

  submitted: boolean = false;

  transactions: ITransaction[] = [];
  selectedTransaction: ITransaction | null = null;

  addTransactionForm: FormGroup;
  updateTransactionForm: FormGroup; // New form for updating

  menuItems: MenuItem[] = [];

  constructor(
    private transactionServ: TransactionService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
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

    const editBtn = {
      label: 'Edit',
      icon: 'pi pi-fw pi-pencil',
      command: () => this.openUpdateTransactionDialog(this.selectedTransaction!),
    };
    const deleteBtn = {
      label: 'Delete',
      icon: 'pi pi-fw pi-trash',
      command: () => this.deleteTransaction(this.selectedTransaction!),
    };

    this.menuItems = [];
    this.menuItems.push(deleteBtn);
    this.menuItems.push(editBtn);
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
    };

    this.addTransactionForm = this.formBuilder.group({
      userId: ['', Validators.required],
      bookId: ['', Validators.required],
      issueDate: [new Date().toISOString().split('T')[0]], // Default to today's date
      dueDate: [new Date().toISOString().split('T')[0]], // Default to today's date
      returnDate: [null],
      status: ['Issued', Validators.required],
      isActive: [true],
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}