import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/core/models/ApiResult';
import { UserService } from '../../services/user.service';
import { IUser } from '../../models/IUser';
import { IRole } from '../../models/IRole';
import { CategoryService } from '../../../categories/services/category.service';
import { TableLoadingService } from 'src/app/core/services/table-loading.service';
import { el } from '@fullcalendar/core/internal-common';
import { Table } from 'primeng/table';
import { TransactionService } from '../../../transactions/services/transaction.service';
import { ITransaction } from '../../../transactions/models/ITransaction';
import { SelectedFilter } from 'src/app/modules/admin/models/SelectedFilters';
import { BookService } from 'src/app/modules/admin/services/book.service';
import { BooksService } from 'src/app/modules/books/services/books.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('dt') dt: Table;
  @ViewChild('filterLibrarians') filterLibrarians!: ElementRef;
  @ViewChild('filterMembers') filterMembers!: ElementRef;

  layout: string = 'dataview';
  loading: boolean = true;
  layoutOptions = [
    { label: 'Grid View', value: 'dataview', icon: 'pi pi-th-large' },
    { label: 'Table View', value: 'table', icon: 'pi pi-list' }
  ];
  tableLoadingSpinner: boolean = true;
  subs: Subscription = new Subscription();
  editUserDialog: boolean = false;
  userDialog: boolean = false;
  deletionUserDialog: boolean = false;
  switchActivationUserDialog: boolean = false;
  submitted: boolean = false;
  UserTransactionsDialog: boolean = false;
  users: IUser[] = [];
  librarians: IUser[] = [];
  members: IUser[] = [];
  roles: IRole[] = [
    { id: "Admin", name: "Admin" },
    { id: "Librarian", name: "Librarian" },
    { id: "Member", name: "Member" }
  ];
  selectedCategoryId: string = '';
  user: IUser;
  userForm: FormGroup;
  editUserForm: FormGroup;
  selectedUserImage: File | null = null;
  profileImageUrl: string = '../../../../../assets/media/upload-photo.jpg';
  menuItems: MenuItem[] = [];
  userTransactions: ITransaction[] = [];
  selectedFilters: SelectedFilter[]
  excelColumns: SelectedFilter[] = [{ name: "FirstName" }, { name: "LastName" }, { name: "Address" }, { name: "DateOfBirth" }, { name: "Email" }, { name: "PhoneNumber" }]
  imageUrl:string='';
  // Status options for filtering
  statusOptions = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
  ];
  // Computed properties for statistics
  get totalUsers(): number {
    return this.users.length;
  }

  constructor(
    private BooksService: BooksService,
    private userServ: UserService,
    private transactionServ: TransactionService,
    private categoryServ: CategoryService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
    private tableLoadingService: TableLoadingService,
  ) {
    this.selectedFilters = this.excelColumns;
    this.initUserModelAndForm();
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

  ngOnInit() {
    this.loadUsers();

    this.tableLoadingService.loading$.subscribe((isLoading) => {
      this.tableLoadingSpinner = isLoading;
    });

    this.menuItems = [
      { label: 'Edit', icon: 'pi pi-pencil', command: () => this.editUser(this.user) },
      { label: 'Delete', icon: 'pi pi-trash', command: () => this.deleteUser(this.user) }
    ];
  }

  assignCurrentSelect(user: IUser) {
    this.user = user;
  }

  loadUsers() {
    this.loading = true;
    this.tableLoadingService.show();
    this.subs.add(
      this.userServ.getAllUsers().subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.users = response.data;
            // Separate users by role
            this.librarians = this.users.filter(user => user.role === 'Librarian');
            this.members = this.users.filter(user => user.role === 'Member');
            console.log('Users loaded:', this.users);
            this.ref.detectChanges();
            this.tableLoadingService.hide();
            this.loading = false;
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message || 'Failed to load users'
            });
            this.loading = false;
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load users'
          });
          this.loading = false;
          this.tableLoadingService.hide();
        }
      })
    );
  }

  ExportToExcel() {
    if (this.selectedFilters === undefined) {
      this.messageService.add({
        severity: 'error',
        summary: 'Export Requirements',
        detail: 'Please select at least one filter from the dropdown before exporting to Excel.',
        life: 3000,
      });
      return;
    }
    this.userServ.ExportToExcel(this.selectedFilters).subscribe(res => {
      this.BooksService.downLoadFile(res, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "UserRecords.xlsx");
    }, err => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed Export to Excel'
      });
    }
    )
  }

  // Table filtering methods
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onGlobalFilterBorrowedBooks(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    if (table === this.dt) {
      this.filterValue = '';
    }
  }

  applyFilterGlobal(event: any, stringVal: string) {
    const searchValue = (event.target as HTMLInputElement).value;
    if (this.dt) {
      this.dt.filterGlobal(searchValue, stringVal);
    } else {
      this.filterValue = searchValue;
      if (this.filterValue) {
        this.librarians = this.users.filter(a =>
          a.role === 'Librarian' &&
          (a.firstName + " " + a.lastName).toLowerCase().includes(this.filterValue.toLowerCase())
        );
        this.members = this.users.filter(a =>
          a.role === 'Member' &&
          (a.firstName + " " + a.lastName).toLowerCase().includes(this.filterValue.toLowerCase())
        );
      } else {
        this.librarians = this.users.filter(user => user.role === 'Librarian');
        this.members = this.users.filter(user => user.role === 'Member');
      }
      this.ref.detectChanges();
    }
  }

  //#region Add User
  addUser() {
    this.isEditing = false;
    this.initUserModelAndForm();
    this.profileImageUrl = '../../../../../assets/media/upload-photo.jpg';
    this.selectedUserImage = null;
    this.userDialog = true;
  }
  saveUser() {    
    console.log("this.selectedUserImage==> ",this.selectedUserImage);
    
    this.submitted = true;
    if (this.userForm.valid) {
      if (this.isEditing) {
       // If editing, update user
      const formData = new FormData();
            formData.append('Id', this.user.id);
      formData.append('FirstName', this.userForm.value.firstName);
      formData.append('LastName', this.userForm.value.lastName);
      formData.append('Email', this.userForm.value.email);
      formData.append('Role', this.userForm.value.role);
      formData.append('PhoneNumber', this.userForm.value.phoneNumber);      
      if (this.selectedUserImage) {  formData.append('ProfileImageUrl', this.selectedUserImage, this.selectedUserImage.name);}      
        this.subs.add(
          this.userServ.updateUser(formData).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'User Updated',
                life: 3000,
              });
              this.loadUsers();
              this.ref.detectChanges();
              this.initUserModelAndForm();
              this.userDialog = false;
              this.isEditing = false;
            },
          })
        );
      } else {
        // If adding new user
      const userData = new FormData();
       userData.append('FirstName', this.userForm.value.firstName);
      userData.append('LastName', this.userForm.value.lastName);
      userData.append('Email', this.userForm.value.email);
      userData.append('Role', this.userForm.value.role);
      userData.append('PhoneNumber', this.userForm.value.phoneNumber);      
      if (this.selectedUserImage) {  
        console.log("adding");
        
        userData.append('ProfileImageUrl', this.selectedUserImage, this.selectedUserImage.name);} 
        this.subs.add(     
          this.userServ.addUser(userData).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'User Added',
                life: 3000,
              });
              this.loadUsers();
              this.ref.detectChanges();
              this.initUserModelAndForm();
              this.userDialog = false;
            },error:(err)=>{
                          
             const serverErrors = err?.error?.errorList; 
          if (Array.isArray(serverErrors)) {
            serverErrors.forEach(error => {
              if (error.key ==="DuplicateEmail") {
                 this.messageService.add({
                  severity: 'error',
                  summary: 'Duplicate Email',
                  detail: 'This email already exists. Please choose a different one',
                  life: 3000,
                });
              }})
              }
                
            }
          }))
      
      }
     } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Fill all fields please',
        life: 3000,
      });
    }

}


  declineAddUserDialog() {
    this.closeDialog();
  }
  //#endregion


  //#region Edit user

  isEditing: boolean = false;

  editUser(user: IUser) {
    this.isEditing = true;
    this.user = { ...user };
    this.imageUrl = user.profileImageUrl ? user.profileImageUrl : '../../../../../assets/media/upload-photo.jpg';
    this.userForm.patchValue({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber:user.phoneNumber,
      role: user.role,
      isActive: user.isActive
    });

    this.userDialog = true;
  }
  private closeDialog(): void {
    this.userDialog = false;
    this.submitted = false;
    this.isEditing = false;
    this.selectedUserImage = null;
    this.imageUrl = 'assets/media/upload-photo.jpg';
    this.initUserModelAndForm();
  }
  //#endregion


  //#region Deletion
  deleteUser(user: IUser) {
    this.deletionUserDialog = true;
    this.user = { ...user };
  }

  confirmDeletion() {
    this.deletionUserDialog = false;
    this.subs.add(
      this.userServ.deleteUser(this.user.id).subscribe({
        next: (response: ApiResult) => {
          if (response.code !== 406) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successfully',
              detail: 'User Deleted Successfully ',
              life: 3000,
            });
            this.loadUsers();
            this.ref.detectChanges();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Cannot delete because there are transactions associated with this User',
              life: 5000,
            });
            this.loadUsers();
            this.ref.detectChanges();
          }
        },
      })
    );
    this.initUserModelAndForm();
    this.deletionUserDialog = false;
  }

  declineDeletion() {
    this.deletionUserDialog = false;
    this.initUserModelAndForm();
  }
  //#endregion


  initUserModelAndForm() {
    this.user = {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      phoneNumber: '',
      profileImageUrl: '',
      isActive: false,
    };

    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      isActive: [true],
    });
  }

  triggerImageUpload() {
    const fileInput = document.getElementById('myUserImage') as HTMLInputElement;
    fileInput.click();
  }

  handleImageSelection(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedUserImage = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
        this.ref.detectChanges();
      };
      reader.readAsDataURL(this.selectedUserImage);
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  filterValue: string = '';

  onFilter(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.filterValue = inputValue;
    if (this.filterValue) {
      this.librarians = this.users.filter(a =>
        a.role === 'Librarian' &&
        (a.firstName + " " + a.lastName).toLowerCase().includes(this.filterValue.toLowerCase())
      );
      this.members = this.users.filter(a =>
        a.role === 'Member' &&
        (a.firstName + " " + a.lastName).toLowerCase().includes(this.filterValue.toLowerCase())
      );
    } else {
      this.librarians = this.users.filter(user => user.role === 'Librarian');
      this.members = this.users.filter(user => user.role === 'Member');
    }
    this.ref.detectChanges();
  }


  hideUserTransactionsDialog() {
    this.UserTransactionsDialog = false;
  }

  getUserTransactions(user: IUser) {
    this.transactionServ.GetTransactionsByUserId(user.id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.userTransactions = res.data;
          this.UserTransactionsDialog = true;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: res.message || 'Failed to get user borrowed books'
          });
        }
      },
      error: (error) => {
        console.error('Error getting user borrowed books:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message ? error.error.message : 'Failed to get user borrowed books'
        });
      }
    })
  }

  getTransactionStatusBadge(status: string) {
    var badge = '';
    switch (status) {
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

  isOverdue(dueDate: Date): boolean {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  }

  //#region Activation
  switchActivation(user: IUser) {
    this.switchActivationUserDialog = true;
    this.user = { ...user };
  }

  confirmActivation() {
    this.switchActivationUserDialog = false;
    // Add activation logic here when backend is ready
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `User ${this.user.isActive ? 'deactivated' : 'activated'} successfully`,
      life: 3000,
    });
    this.loadUsers();
    this.ref.detectChanges();
  }

  declineActivation() {
    this.switchActivationUserDialog = false;
  }
  //#endregion
}