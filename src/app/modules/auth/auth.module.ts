import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { LMSSharedModule } from 'src/app/shared/lms-shared.module';
import { LoginComponent } from './login/login.component';

@NgModule({
    declarations: [LoginComponent],
    imports: [
        LMSSharedModule,
        AuthRoutingModule
    ]
})
export class AuthModule { }
