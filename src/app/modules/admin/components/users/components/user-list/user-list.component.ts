import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/core/models/ApiResult';
import { UserService } from '../../services/user.service';
import { IUser } from '../../models/IUser';
import { IRole } from '../../models/IRole';
import { CategoryService } from '../../../categories/services/category.service';
import { TableLoadingService } from 'src/app/core/services/table-loading.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewChecked, OnDestroy {

  layout: string = 'list';

  tableLoadingSpinner: boolean = true;
  subs: Subscription = new Subscription();

  editUserDialog: boolean = false;
  userDialog: boolean = false;
  deletionUserDialog: boolean = false;
  switchActivationUserDialog: boolean = false;

  submitted: boolean = false;

  users: IUser[] = [];
  roles: IRole[] = [
    { id: "Admin",name:"Admin"},
    { id: "Librarian",name:"Librarian"},
    { id: "Member",name:"Member"}
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
    this.tableLoadingService.show();
    this.subs.add(
      this.userServ.getAllUsers().subscribe((data) => {
        this.users = data.data;
        console.log(this.users)
        this.ref.detectChanges();
        this.tableLoadingService.hide();
      })
    );
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
      const formData = new FormData();
      formData.append('FirstName', this.userForm.value.firstName);
      formData.append('LastName', this.userForm.value.lastName);
      formData.append('email', this.userForm.value.email);
      formData.append('Role', this.userForm.value.role);
      formData.append('isActive', this.userForm.value.isActive);

      const userImageFile = this.selectedUserImage;
      if (userImageFile) {
        formData.append('profileImageUrl', userImageFile, userImageFile.name);
      }

      if (this.isEditing) {
        // If editing, update user
        formData.append('Id', this.user.id);
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
        this.subs.add(
          this.userServ.addUser(formData).subscribe({
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
      email:'',
      role : '',
      profileImageUrl: '',
      isActive: false,
    };

    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      role: ['', Validators.required],
      profileImageUrl: [''],
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
  }
}