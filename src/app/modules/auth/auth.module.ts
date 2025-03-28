import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { LMSSharedModule } from 'src/app/shared/lms-shared.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
    declarations: [LoginComponent,RegisterComponent],
    imports: [
        LMSSharedModule,
        AuthRoutingModule
    ]
})
export class AuthModule { }
