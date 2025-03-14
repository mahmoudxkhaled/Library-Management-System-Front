import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../admin/components/users/services/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {

    valCheck: string[] = ['remember'];

    loginForm: FormGroup;
    submitted: boolean = false;
    message:string;
    constructor(
        private userService: UserService,
        public layoutService: LayoutService,
        private formBuilder: FormBuilder,
        private router: Router) {

            this.loginForm = this.formBuilder.group({
                email: ['', Validators.required],
                password: ['', Validators.required]
              });
         }


    login(){
        this.submitted = true;
        this.message = "";
        if (this.loginForm.valid){
            this.userService.login({
                email: this.loginForm.value.email,
                password: this.loginForm.value.password
            }).subscribe({
                next: (result) => {
                  if(result.isSuccess){
                    localStorage.setItem('userData',JSON.stringify(result.data));
                      this.router.navigate(['/']);
                  }
                  else{
                    this.message = result.message;
                  }
                },
                error: (error)=>{
                    if(error.status == 400){
                        this.message = error.error.message;
                    }
                    else{
                        this.message = "An error occured";
                    }
                }
              },
            )
        }
    }
}
