import { Routes } from '@angular/router';
import { VorgabenComponent } from './manuals/vorgaben/vorgaben.component';
import { ContentComponent } from './components/content/content.component';
import { LoginComponent } from './components/Auth/login/login.component';
import { SignUpComponent } from './components/Auth/sign-up/sign-up.component';
import { SendPwResetComponent } from './components/Auth/send-pw-reset/send-pw-reset.component';
import { ResetPwComponent } from './components/Auth/reset-pw/reset-pw.component';
import { UserActivationComponent } from './components/Auth/user-activation/user-activation.component';

export const routes: Routes = [
    { path: '', component: ContentComponent, pathMatch: 'full' },
    { path: 'vorgaben' , component: VorgabenComponent },
    { path: 'signin' , component: LoginComponent },
    { path: 'signup' , component: SignUpComponent },
    { path: 'reset-mail' , component: SendPwResetComponent },
    { path: 'reset-pw/:token' , component: ResetPwComponent },
    { path: 'activate/:token', component: UserActivationComponent },

];
