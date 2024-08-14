import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environtments/environtment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserFeedBackComponent } from '../../Overlays/user-feed-back/user-feed-back.component';

@Component({
  selector: 'app-send-pw-reset',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, RouterLink,UserFeedBackComponent],
  templateUrl: './send-pw-reset.component.html',
  styleUrl: './send-pw-reset.component.scss'
})
export class SendPwResetComponent {
  email: string = '';
  password: string = '';
  hide: boolean = true;
  send: boolean = false;
  loginFailed: boolean = false;
  failMessage: string = '';
  message = ``;
  success: boolean = false;

  constructor(private http: HttpClient, private router: Router) { this.addEnterListener() }

  addEnterListener() {
    addEventListener('keydown', (e: KeyboardEvent) => {

      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        if (this.email !== '') {
          this.getResetPasswordMail();
        } else this.setErrorMessage('Bitte fülle alle Felder aus!', { error: 'Bitte fülle alle Felder aus!' });
      }

    }
    );
  }
  async getResetPasswordMail() {
    this.send = true;
    const url = environment.baseUrl + '/resetPasswordMail/';
    const body = {
      email: this.email,
    };
    let response: any;
    try {
      response = await lastValueFrom(this.http.post(url, body));
      this.success = true;
      this.setErrorMessage('Email wurde versendet!', response.message);
      setTimeout(() => {
        this.router.navigateByUrl('/signin');
      }, 3000);
      this.success = false;
    } catch (e) {
      let error: any = e;

      if (error.status == 404) {
        this.setErrorMessage(' Benutzer mit dieser Emailadresse nicht vorhanden.', error);
      }
      else if (error.status == 400) {
        this.setErrorMessage(' Bitte gib eine Emailadresse ein.', error);
      } else {
        this.setErrorMessage('Email wurde versendet!', error);
        setTimeout(() => {
          this.router.navigateByUrl('/signin');
        }, 3000);
      }
    }
  }

  setErrorMessage(message: string, error: any) {
    this.loginFailed = true;
    this.failMessage = error.error;
    this.message = message;
    this.resetErrorMessage();
  }

  resetErrorMessage() {
    setTimeout(() => {
      this.loginFailed = false;
      this.failMessage = '';
      this.message = '';
      this.send = false;
      const emailField = document.getElementById('emailField') as HTMLInputElement;
      emailField.value = '';
    }, 3000);

  }
}
