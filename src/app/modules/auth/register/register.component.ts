import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../admin/components/users/services/user.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

    registerForm: FormGroup;
    submitted: boolean = false;
    message: string = '';

    constructor(
        private userService: UserService,
        public layoutService: LayoutService,
        private formBuilder: FormBuilder,
        private service: MessageService,
        private router: Router) {

        this.registerForm = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.minLength(2)]],
            phoneNumber: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        }, { validator: this.passwordMatchValidator });
    }

    passwordMatchValidator(form: FormGroup) {
        const password = form.get('password')?.value;
        const confirmPassword = form.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { mismatch: true };
    }

    register() {
        this.submitted = true;
        this.message = "";

        if (this.registerForm.valid) {
            this.userService.register(this.registerForm.value).subscribe({
                next: (result) => {
                    if (result.isSuccess) {
                        this.service.add({
                            key: 'tst',
                            severity: 'success',
                            summary: 'Success Message',
                            detail: 'Account created successfully! Redirecting to login...'
                        });
                        setTimeout(() => {
                            this.router.navigate(['/auth/login']);
                        }, 1500);
                    } else {
                        this.message = result.message;
                    }
                },
                error: (error) => {
                    if (error.status == 400) {
                        this.message = error.error.message;
                    } else {
                        this.message = "An error occurred. Please try again.";
                    }
                }
            });
        }
    }
}
