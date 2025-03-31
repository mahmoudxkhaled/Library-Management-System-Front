import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('dt') dt: Table;

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

  constructor(
    private userServ: UserService,
    private categoryServ: CategoryService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
    private tableLoadingService: TableLoadingService,
  ) {
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
          console.error('Error loading users:', error);
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
    this.initUserModelAndForm();
    this.profileImageUrl = '../../../../../assets/media/upload-photo.jpg';
    this.selectedUserImage = null;
    this.userDialog = true;
  }
  saveUser() {
    this.submitted = true;
    if (this.userForm.valid) {
      if (this.isEditing) {
        // If editing, update user
        // this.subs.add(
        //   this.userServ.updateUser(formData).subscribe({
        //     next: () => {
        //       this.messageService.add({
        //         severity: 'success',
        //         summary: 'Successful',
        //         detail: 'User Updated',
        //         life: 3000,
        //       });
        //       this.loadUsers();
        //       this.ref.detectChanges();
        //       this.initUserModelAndForm();
        //       this.userDialog = false;
        //       this.isEditing = false;
        //     },
        //   })
        // );
      } else {
        // If adding new user
        this.subs.add(
          this.userServ.addUser(this.userForm.value).subscribe({
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
            },
          })
        );
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
    this.submitted = false;
    this.initUserModelAndForm();
    this.userDialog = false;
    this.isEditing = false;
  }
  //#endregion


  //#region Edit user

  isEditing: boolean = false;

  editUser(user: IUser) {
    this.isEditing = true;
    this.user = { ...user };
    this.profileImageUrl = user.profileImageUrl ? user.profileImageUrl : '../../../../../assets/media/upload-photo.jpg';

    this.userForm.patchValue({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });

    this.userDialog = true;
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
        this.profileImageUrl = e.target.result;
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
}