import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PreLoginComponent } from './components/header/pre-login/pre-login.component';
import { PostLoginComponent } from './components/header/post-login/post-login.component';
import { AuthService } from './services/auth/auth.service';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,HeaderComponent,FooterComponent,PreLoginComponent,PostLoginComponent,],
  providers: [HttpClient,AuthService,HttpClientModule,NgModel],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'bloom-frontend';

  constructor() {

  }
}
