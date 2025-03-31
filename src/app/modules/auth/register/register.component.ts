import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../admin/components/users/services/user.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
        :host ::ng-deep .md\:col-12{
            padding: 5px !important;
        }

    `]
})
export class RegisterComponent {


    registerForm: FormGroup;
    submitted: boolean = false;
    message:string;
    constructor(
        private userService: UserService,
        public layoutService: LayoutService,
        private formBuilder: FormBuilder,
        private service: MessageService,
        private router: Router) {

            this.registerForm = this.formBuilder.group({
                firstName:['', Validators.required],
                lastName:['', Validators.required],
                phoneNumber:['', Validators.required],
                email: ['', Validators.required],                
                password: ['', Validators.required],
                confirmPassword: ['', Validators.required]
              }, { validator: this.passwordMatchValidator });
         }

         passwordMatchValidator(form: FormGroup) {
            const password = form.get('password')?.value;
            const confirmPassword = form.get('confirmPassword')?.value;
            return password === confirmPassword ? null : { mismatch: true };
          }
    register(){
        this.submitted = true;
        this.message = "";
        if (this.registerForm.valid){
            this.userService.register(this.registerForm.value).subscribe({
                next: (result) => {
                  if(result.isSuccess){
                      this.service.add({ key: 'tst', severity: 'success', summary: 'Success Message', detail: 'User has been created successfully' });
                      setTimeout(() => {
                        this.router.navigate(['/auth/login']);
                      }, 1000);
                      
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
