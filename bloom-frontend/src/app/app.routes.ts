import { Routes } from '@angular/router';
import { VorgabenComponent } from './manuals/vorgaben/vorgaben.component';
import { ContentComponent } from './components/content/content.component';
import { LoginComponent } from './components/Auth/login/login.component';

export const routes: Routes = [
    { path: '', component: ContentComponent, pathMatch: 'full' },
    { path: 'vorgaben' , component: VorgabenComponent },
    { path: 'signin' , component: LoginComponent },
];
