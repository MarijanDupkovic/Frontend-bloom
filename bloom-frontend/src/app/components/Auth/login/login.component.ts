import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, HttpClientModule],
  providers: [ ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  hide: boolean = true;
  send: boolean = false;
  signedIn: boolean = false;

  login_failed: boolean = false;
  fail_message: string = '';
  message = ``;

  constructor(private authService: AuthService, private router: Router) {
    this.addEnterListener();
  }

  async login() {
    let resp: any;
    this.send = true;
    try {
      console.log('try login');
      await this.authService.loginWithEmailandPassword(this.email, this.password).then((response: any) => {
        resp = response;
        console.log('tried login');

        this.router.navigateByUrl('/site/dashboard');
      });
      // localStorage.setItem('token', resp['token']);

    } catch (e) {
      let error: any = e;
      if (error.status == 403) this.setErrorMessage(' Bitte bestätige zuerst deine Emailadresse.', error);
      else if (error.status == 401) this.setErrorMessage(' Benutzername oder Password ist nicht korrekt.', error);
      else if (error.status == 404) this.setErrorMessage('Emailadresse ist nicht korrekt.', error);
    }
  }

  togglePWField(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.hide = !this.hide;
  }

  setErrorMessage(message: string, error: any) {
    this.login_failed = true;
    this.fail_message = error.error;
    this.message = message;
    this.resetErrorMessage();
  }

  resetErrorMessage() {
    setTimeout(() => {
      if (this.login_failed) {
        const passwordField = document.getElementById('passwordField') as HTMLInputElement;
        passwordField.value = '';
      }
      this.login_failed = false;
      this.fail_message = '';
      this.message = '';
      this.send = false;

    }, 3000);
  }

  async addEnterListener() {
    addEventListener('keydown', async (e: KeyboardEvent) => {

      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        if (this.password !== '' && this.email !== '') {
          this.login();
        } else this.setErrorMessage('Bitte fülle alle Felder aus!', { error: 'Bitte fülle alle Felder aus!' });
      }

    }
    );
  }
}
