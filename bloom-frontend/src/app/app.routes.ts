import { Routes } from '@angular/router';
import { ContentComponent } from './components/content/content.component';
import { LoginComponent } from './components/Auth/login/login.component';
import { SignUpComponent } from './components/Auth/sign-up/sign-up.component';
import { SendPwResetComponent } from './components/Auth/send-pw-reset/send-pw-reset.component';
import { ResetPwComponent } from './components/Auth/reset-pw/reset-pw.component';
import { UserActivationComponent } from './components/Auth/user-activation/user-activation.component';
import { AuthguardService } from './guards/auth/authguard.service';
import { UserComponent } from './components/post-login/user/user.component';
import { PostAppComponent } from './components/post-login/post-app/post-app.component';
import { EditUserComponent } from './components/post-login/edit-user/edit-user.component';
import { LibraryComponent } from './components/post-login/library/library.component';
import { RecordingComponent } from './components/post-login/recording/recording.component';
import { PublicVideoComponent } from './components/public-video/public-video.component';
import { VideoDetailComponent } from './components/post-login/video-detail/video-detail.component';
import { ContactComponent } from './components/content/contact/contact.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { LegalComponent } from './components/legal/legal.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: ContentComponent },
    { path: 'signin', component: LoginComponent },
    { path: 'signup', component: SignUpComponent },
    { path: 'reset-mail', component: SendPwResetComponent },
    { path: 'resetPassword/:token', component: ResetPwComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'activate/:token', component: UserActivationComponent },
    { path: 'public-video/:str', component: PublicVideoComponent },
    { path: 'privacy', component:PrivacyComponent},
    { path: 'legal', component:LegalComponent},

    {
        path: 'site', component: PostAppComponent, canActivate: [AuthguardService],
        children: [
            { path: 'profile' , component:UserComponent },
            { path: 'edit-profile' , component:EditUserComponent },
            { path: 'library' , component:LibraryComponent },
            { path: 'recording' , component:RecordingComponent },
            { path: 'video-details/:str', component: VideoDetailComponent },
        ]
    },

];
