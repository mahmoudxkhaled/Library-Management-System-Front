import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { LayoutService } from "../service/app.layout.service";
import { UserService } from 'src/app/modules/admin/components/users/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from 'src/app/modules/admin/components/users/models/IUser';
import { IUserLogged } from 'src/app/modules/admin/components/users/models/UserLogged';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ApiResult } from 'src/app/core/models/ApiResult';
import { NgxSpinnerService } from 'ngx-spinner';
export function passwordsMatchValidator(newPassword:string,confirmPassword:string):ValidatorFn
{
    return (FormGroup:AbstractControl):ValidationErrors | null=>{
        var newPass=FormGroup.get(newPassword)?.value;
        var confirmPass=FormGroup.get(confirmPassword)?.value;
        var errors=FormGroup.get(confirmPassword).errors;
        if (newPass !== confirmPass) {
            FormGroup.get('confirmNewPassword')?.setErrors({ ...errors,passwordMismatch: true });
          } else {
            var Errors=FormGroup.get('confirmNewPassword')?.errors;
            if(Errors)
            {
          var passwordMismatch=  FormGroup.get('confirmNewPassword')?.errors['passwordMismatch'];
          if(passwordMismatch !=null)
            delete  FormGroup.get('confirmNewPassword').errors['passwordMismatch']
          }
        }
          return null;
        }

}
@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})

export class AppTopBarComponent implements OnInit{
    userObj:ApiResult
    items!: MenuItem[];
    user:IUserLogged;
    submitted:boolean=false;
    changePasswordObj:FormGroup;
    UpdateUserProfileObj:FormGroup;
    changePasswordDialog:boolean=false;
    selectedUserImage: File | null = null;
    userProfileDialog:boolean=false;
    imageUrl:string | null;
    menuItems: MenuItem[] = [
        { label: 'Profile', icon: 'pi pi-user-edit', command: ()=>this.showUserProfileDetails()},
        { label: 'Borrowed Books', icon: 'pi pi-book', command: ()=> this.goToTransactions() },
        // { label: 'Reservations', icon: 'pi pi-bookmark-fill', command: null },
        { label: 'Change Password', icon: 'pi pi-key', command: ()=>this.changePasswordDialog=true },
        { separator: true },
        { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.Logout() }
      ]; 
    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('topbarmenu') menu!: ElementRef;
    constructor(public layoutService: LayoutService,private router:Router,private UserService:UserService,private fb:FormBuilder,private messageService:MessageService,private spinner:NgxSpinnerService) 
    {
       this.user=this.UserService.getLoggedInUser();
console.log('✌️this.user --->', this.user);
     }
    ngOnInit(): void {
        this.changePasswordObj=this.fb.group({
            currentPassword:['',[Validators.required]],
            newPassword:['',[Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$')]],
            confirmNewPassword	:['',[Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$')]],
        })
        this.changePasswordObj.setValidators(passwordsMatchValidator('newPassword','confirmNewPassword'));
        this.UpdateUserProfileObj=this.fb.group({
            FirstName:['',[Validators.required,Validators.pattern('^[a-zA-Z0-9]*[a-zA-Z]+[a-zA-Z0-9]*$')]],
            LastName:['',[Validators.required,Validators.pattern('^[a-zA-Z0-9]*[a-zA-Z]+[a-zA-Z0-9]*$')]],
            UserName:['',[Validators.required,Validators.pattern('^[A-Za-z][A-Za-z0-9@._-]*$')]],
            Email:['',[Validators.required,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
            PhoneNumber:['',[Validators.pattern('^[0-9]+$')]]
        })
    }
    EditPassword()
    {
        this.submitted=true;
        if(this.changePasswordObj.invalid)
        {
            console.log("invalid");
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill in all fields with valid data',
                life: 3000,
              });
              return;
        }
        var obj ={currentPassword:this.currentPassword.value,newPassword:this.newPassword.value}
        this.UserService.changePassword(obj).subscribe(res=>{
            this.changePasswordDialog=false;
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Password Updated',
                life: 3000,
              });
        },err=>{
            if(err.error.errors[0].code=='PasswordMismatch')
            {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'The current password you entered is incorrect. Please try again.',
                    life: 3000,
                  });
                  this.changePasswordObj.get('currentPassword').setValue('');
            }
            else
            {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'error in Update password',
                    life: 3000,
                  });
            }
        
        });
    }
    cancelDialog()
    {
        this.changePasswordDialog=false;
        this.submitted=false;
    }
    Logout(){
        this.UserService.Logout();
    }
    get currentPassword()
    {
        return this.changePasswordObj.get('currentPassword')
    }
    get newPassword()
    {
        return this.changePasswordObj.get('newPassword')
    }
    get confirmNewPassword()
    {
        return this.changePasswordObj.get('confirmNewPassword')
    }


    cancelUserProfileDialog()
    {
        this.userProfileDialog=false;
        this.imageUrl=null;
        this.selectedUserImage=null;
        this.submitted=false;
    }
    get FirstName()
    {
        return this.UpdateUserProfileObj.get('FirstName')
    }
    get LastName()
    {
        return this.UpdateUserProfileObj.get('LastName')
    }
    get UserName()
    {
        return this.UpdateUserProfileObj.get('UserName')
    }
    get Email()
    {
        return this.UpdateUserProfileObj.get('Email')
    }
    get PhoneNumber()
    {
        return this.UpdateUserProfileObj.get('PhoneNumber')
    }
    showUserProfileDetails()
    {
        this.spinner.show();
        this.UserService.GetCurrentUserDetails().subscribe(res=>{
            this.userObj=res;            
console.log('✌️ this.userObj --->',  this.userObj);
            this.UpdateUserProfileObj.patchValue({
                FirstName:this.userObj.data.firstName,
                LastName:this.userObj.data.lastName,
                UserName:this.userObj.data.userName,
                PhoneNumber:this.userObj.data.phoneNumber,
                Email:this.userObj.data.email
            })
            this.imageUrl=this.userObj.data.profileImageUrl
            this.spinner.hide()
            this.userProfileDialog=true;
        },err=>{
            console.log('err :',err);
        })
    }
    UpdateUserProfile()
    {
        this.submitted=true;
        if(this.UpdateUserProfileObj.invalid)
        {
            console.log("invalid");
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill in all fields with valid data',
                life: 3000,
              });
              return;
        }
        console.log("selectedUserImage :",this.selectedUserImage);
        if((this.FirstName.value==this.userObj.data.firstName) && (this.LastName.value==this.userObj.data.lastName) && (this.UserName.value==this.userObj.data.userName) && (this.PhoneNumber.value==this.userObj.data.phoneNumber) && (this.Email.value==this.userObj.data.email)&&(this.selectedUserImage==null))
        {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No changes detected. Please modify at least one field to proceed.',
                life: 3000,
              });
            return;
        }
        this.spinner.show();
        const UpdateUserProfile = new FormData();
        UpdateUserProfile.append('id', this.userObj.data.id);
        UpdateUserProfile.append('firstName', this.FirstName.value);
        UpdateUserProfile.append('lastName', this.LastName.value);
        UpdateUserProfile.append('userName', this.UserName.value);
        UpdateUserProfile.append('email', this.Email.value);
        UpdateUserProfile.append('phoneNumber', this.PhoneNumber.value);
         if(this.selectedUserImage !=null)    
              UpdateUserProfile.append('profileImageUrl', this.selectedUserImage, this.selectedUserImage.name);        
        this.UserService.UpdateUserProfile(UpdateUserProfile).subscribe(res=>{
            this.user.firstName=this.FirstName.value;
            this.user.lastName=this.LastName.value;
            this.user.userImageUrl=this.imageUrl;
            this.user.email=this.Email.value;
            this.UserService.updateLoggedUser(this.user);
            this.userProfileDialog=false;
            this.spinner.hide();
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'User Profile Updated',
                life: 3000,
              });
        },err=>{
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'error in Update User Profile',
                    life: 3000,
                  });
                  this.spinner.hide();
        });
    }
    triggerImageUpload()
  {
    const fileInput = document.getElementById('userImage') as HTMLInputElement;
    fileInput.click();
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

  goToTransactions(){
    this.router.navigate(['user/transactions']);
  }
}
