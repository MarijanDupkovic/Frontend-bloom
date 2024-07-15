import { UserService } from './../../../services/profile/user.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserFeedBackComponent } from '../../Overlays/user-feed-back/user-feed-back.component';

@Component({
  selector: 'app-reset-pw',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, RouterLink, UserFeedBackComponent],
  templateUrl: './reset-pw.component.html',
  styleUrl: './reset-pw.component.scss'
})
export class ResetPwComponent implements OnInit{
  password: string = '';
  password2: string = '';
  hide: boolean = true;
  hide2: boolean = true;
  send: boolean = false;
  loginFailed: boolean = false;
  failMessage: string = '';
  message = ``;

  constructor(private route: ActivatedRoute, private http: HttpClient, private userService: UserService) {

  }

  ngOnInit() {

    // this.addEnterListener();
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
        if (this.password !== '' && this.password2 !== '') {
          this.resetPassword();
        } else this.setErrorMessage('Passwort darf nicht leer sein', { error: 'Bitte fülle alle Felder aus!' });
      }
    }
    );
  }


  async resetPassword() {
    const token = this.route.snapshot.paramMap.get('token');
      const url = '/resetPassword/' + token + '/';
      let response = await this.userService.resetPassword(url, {
        pw1: this.password,
        pw2: this.password2
      });
      if ((response as any).message === 'Passwort stimmt nicht mit Passwort2 überein!') {
        this.setErrorMessage('Passwort stimmt nicht mit Passwort2 überein!', response);
      } else {
        this.setErrorMessage('Passwort erfolgreich geändert! Du wirst zum Login weitergeleitet', response);
        setTimeout(() => {
          window.location.href = '/signin';
        }, 3000);
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
      this.clearPasswordFields()
    }, 3000);

  }

  private clearPasswordFields(): void {
    this.password = '';
    this.password2 = '';
  }
}
