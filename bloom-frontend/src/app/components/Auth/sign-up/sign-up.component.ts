import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, CommonModule,HttpClientModule,RouterLink],
  providers: [AuthService,HttpClient,Router],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  email: string = '';
  password: string = '';
  password2: string = '';
  username: string = '';
  hide: boolean = true;
  hide2: boolean = true;
  send: boolean = false;
  fail_message: string = '';
  message = ``;
  success: boolean = false;
  signup_failed: boolean = false;
  constructor(private authService: AuthService, private router: Router) { this.addEnterListener() }

  async signup() {
    this.send = true;
    try {
      
      let resp: any = await this.authService.signUp(this.email, this.password, this.password2, this.username);
      this.success = true;
      setTimeout(() => this.router.navigateByUrl('/login'), 5000);
    } catch (e) {
      let error: any = e;
      if (error.status == 405) {
        this.setErrorMessage('Email oder username bereits in Verwendung', error);
      }

    }
  }
  resetErrorMessage() {
    setTimeout(() => {

      this.signup_failed = false;
      this.fail_message = '';
      this.message = '';
      this.send = false;
      const passwordField = document.getElementById('passwordField') as HTMLInputElement;
      const emailField = document.getElementById('emailField') as HTMLInputElement;
      const usernameField = document.getElementById('usernameField') as HTMLInputElement;
      const passwordField2 = document.getElementById('passwordField2') as HTMLInputElement;
      passwordField.value = '';
      passwordField2.value = '';
      emailField.value = '';
      usernameField.value = '';
    }, 3000);

  }

  setErrorMessage(message: string, error: any) {
    this.signup_failed = true;
    this.fail_message = error.error;
    this.message = message;
    this.resetErrorMessage();
  }
  togglePWField(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.hide = !this.hide;
  }
  togglePWField2(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.hide2 = !this.hide2;
  }
  addEnterListener() {
    addEventListener('keydown', (e: KeyboardEvent) => {
     
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        if (this.password !== '' && this.password2 !== '' && this.email !== '') {
          this.signup();
        } else this.setErrorMessage('Bitte fülle alle Felder aus!', { error: 'Bitte fülle alle Felder aus!' });
      }

    }
    );
  }
}
