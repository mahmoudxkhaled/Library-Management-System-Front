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
        { separator: true },
        { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.Logout() }
      ]; 
    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('topbarmenu') menu!: ElementRef;
    constructor(public layoutService: LayoutService,private router:Router,private UserService:UserService,private fb:FormBuilder,private messageService:MessageService,private spinner:NgxSpinnerService) 
    {
      this.UserService.currentUser$.subscribe(res=>{
         this.user=res;
       });
     }
    ngOnInit(): void {
      
    }
 
    cancelDialog()
    {
        this.changePasswordDialog=false;
        this.submitted=false;
    }
    Logout(){
        this.UserService.Logout();
    }

    showUserProfileDetails()
    {
     this.router.navigate(['user','profile']);
    }
  goToTransactions(){
    this.router.navigate(['user/transactions']);
  }
}
