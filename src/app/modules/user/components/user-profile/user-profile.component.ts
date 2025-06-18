import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ApiResult } from 'src/app/core/models/ApiResult';
import { IUserLogged } from 'src/app/modules/admin/components/users/models/UserLogged';
import { UserService } from 'src/app/modules/admin/components/users/services/user.service';
export function passwordsMatchValidator(newPassword: string, confirmPassword: string): ValidatorFn {
  return (FormGroup: AbstractControl): ValidationErrors | null => {
    var newPass = FormGroup.get(newPassword)?.value;
    var confirmPass = FormGroup.get(confirmPassword)?.value;
    var errors = FormGroup.get(confirmPassword).errors;
    if (newPass !== confirmPass) {
      FormGroup.get('confirmNewPassword')?.setErrors({ ...errors, passwordMismatch: true });
    } else {
      var Errors = FormGroup.get('confirmNewPassword')?.errors;
      if (Errors) {
        var passwordMismatch = FormGroup.get('confirmNewPassword')?.errors['passwordMismatch'];
        if (passwordMismatch != null)
          delete FormGroup.get('confirmNewPassword').errors['passwordMismatch']
      }
    }
    return null;
  }

}
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  userObj: ApiResult
  datePipe = new DatePipe('en-US');
  user: IUserLogged;
  submitPassword: boolean = false;
  submitUserProfileData: boolean = false;
  changePasswordObj: FormGroup;
  UpdateUserProfileObj: FormGroup;
  changePasswordDialog: boolean = false;
  selectedUserImage: File | null = null;
  userProfileDialog: boolean = false;
  imageUrl: string | null;
  constructor(private UserService: UserService, private fb: FormBuilder, private messageService: MessageService, private spinner: NgxSpinnerService) {

  }
  ngOnInit(): void {
    this.user = this.UserService.getLoggedInUser();
    this.changePasswordObj = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$')]],
      confirmNewPassword: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$')]],
    })
    this.changePasswordObj.setValidators(passwordsMatchValidator('newPassword', 'confirmNewPassword'));
    this.UpdateUserProfileObj = this.fb.group({
      FirstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*[a-zA-Z]+[a-zA-Z0-9]*$')]],
      LastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*[a-zA-Z]+[a-zA-Z0-9]*$')]],
      PhoneNumber: ['', [Validators.pattern('^[0-9]+$')]],
      DateOfBirth: [null],
      Address: ['']
    })
    this.UserService.GetCurrentUserDetails().subscribe(res => {
      this.userObj = res;

      this.UpdateUserProfileObj.patchValue({
        FirstName: this.userObj.data.firstName,
        LastName: this.userObj.data.lastName,
        Address: this.userObj.data.address,
        PhoneNumber: this.userObj.data.phoneNumber,
        DateOfBirth: this.userObj.data.dateofBirth != null ? new Date(this.userObj.data.dateofBirth) : null
      })
      this.imageUrl = this.userObj.data.profileImageUrl
    }, err => {

    })
  }
  EditPassword() {
    this.submitPassword = true;
    if (this.changePasswordObj.invalid) {

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all fields with valid data',
        life: 3000,
      });
      return;
    }
    var obj = { currentPassword: this.currentPassword.value, newPassword: this.newPassword.value }
    this.UserService.changePassword(obj).subscribe(res => {
      this.changePasswordDialog = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Password Updated',
        life: 3000,
      });
    }, err => {
      if (err.error.errors[0].code == 'PasswordMismatch') {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'The current password you entered is incorrect. Please try again.',
          life: 3000,
        });
        this.changePasswordObj.get('currentPassword').setValue('');
      }
      else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'error in Update password',
          life: 3000,
        });
      }

    });
  }
  handleImageSelection(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedUserImage = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedUserImage);
    }
  }
  UpdateUserProfile() {
    this.submitUserProfileData = true;
    if (this.UpdateUserProfileObj.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all fields with valid data',
        life: 3000,
      });
      return;
    }
    if ((this.FirstName.value == this.userObj.data.firstName) && (this.LastName.value == this.userObj.data.lastName) && (this.Address.value == this.userObj.data.address) && (this.datePipe.transform(this.DateOfBirth.value, 'yyyy-MM-dd') == this.datePipe.transform(this.userObj.data.dateofBirth, 'yyyy-MM-dd')) && (this.PhoneNumber.value == this.userObj.data.phoneNumber) && (this.selectedUserImage == null)) {
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'No changes detected.',
        life: 3000,
      });
      return;
    }
    const UpdateUserProfile = new FormData();
    UpdateUserProfile.append('id', this.userObj.data.id);
    UpdateUserProfile.append('firstName', this.FirstName.value);
    UpdateUserProfile.append('lastName', this.LastName.value);
    UpdateUserProfile.append('phoneNumber', this.PhoneNumber.value);
    if (this.DateOfBirth.value != null)
      UpdateUserProfile.append('DateOfBirth', new DatePipe('en-US').transform(this.DateOfBirth.value, 'yyyy-MM-dd'));
    UpdateUserProfile.append('Address', this.Address.value);
    if (this.selectedUserImage != null)
      UpdateUserProfile.append('profileImageUrl', this.selectedUserImage, this.selectedUserImage.name);

    this.UserService.UpdateUserProfile(UpdateUserProfile).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'User Profile Updated',
        life: 3000,
      });
      this.userObj.data.firstName = this.FirstName.value;
      this.userObj.data.lastName = this.LastName.value;
      this.userObj.data.phoneNumber = this.PhoneNumber.value;
      this.userObj.data.address = this.Address.value;
      this.userObj.data.dateofBirth = this.DateOfBirth.value;
      this.user.firstName = this.FirstName.value;
      this.user.lastName = this.LastName.value;
      this.user.userImageUrl = this.imageUrl;
      this.UserService.updateLoggedUser(this.user);
      this.selectedUserImage = null
    }, err => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'error in Update User Profile',
        life: 3000,
      });
    });
  }
  triggerImageUpload() {
    const fileInput = document.getElementById('userImage') as HTMLInputElement;
    fileInput.click();
  }
  cancelDialog() {
    this.changePasswordDialog = false;
    this.submitPassword = false;
  }

  cancelProfileChanges() {
    // Reset form to original values
    this.UpdateUserProfileObj.patchValue({
      FirstName: this.userObj.data.firstName,
      LastName: this.userObj.data.lastName,
      Address: this.userObj.data.address,
      PhoneNumber: this.userObj.data.phoneNumber,
      DateOfBirth: this.userObj.data.dateofBirth != null ? new Date(this.userObj.data.dateofBirth) : null
    });
    this.imageUrl = this.userObj.data.profileImageUrl;
    this.selectedUserImage = null;
    this.submitUserProfileData = false;
  }
  changePasswordDialogFun() {
    this.changePasswordDialog = true;
  }
  get FirstName() {
    return this.UpdateUserProfileObj.get('FirstName')
  }
  get LastName() {
    return this.UpdateUserProfileObj.get('LastName')
  }
  get Address() {
    return this.UpdateUserProfileObj.get('Address')
  }
  get DateOfBirth() {
    return this.UpdateUserProfileObj.get('DateOfBirth')
  }
  get PhoneNumber() {
    return this.UpdateUserProfileObj.get('PhoneNumber')
  }
  get currentPassword() {
    return this.changePasswordObj.get('currentPassword')
  }
  get newPassword() {
    return this.changePasswordObj.get('newPassword')
  }
  get confirmNewPassword() {
    return this.changePasswordObj.get('confirmNewPassword')
  }


}
