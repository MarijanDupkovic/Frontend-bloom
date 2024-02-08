import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environtments/environtment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-pw',
  standalone: true,
  imports: [FormsModule, CommonModule,HttpClientModule,RouterLink],
  providers: [HttpClient, ActivatedRoute],

  templateUrl: './reset-pw.component.html',
  styleUrl: './reset-pw.component.scss'
})
export class ResetPwComponent {
  password: string = '';
  password2: string = '';
  hide: boolean = true;
  hide2: boolean = true;
  send: boolean = false;
  login_failed: boolean = false;
  fail_message: string = '';
  message = ``;

  constructor(private route: ActivatedRoute, private http: HttpClient) { 
    
  }

  ngOnInit() {
    
    this.addEnterListener();
  }

  togglePWField(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.hide = !this.hide;
  }
  togglePWField2(e: Event){
    e.preventDefault();
    e.stopPropagation();
    this.hide2 = !this.hide2;
  }

  addEnterListener() {
   addEventListener('keydown', (e: KeyboardEvent) => {
   
      if(e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        if(this.password !== '' && this.password2 !== '') {
           this.resetPassword();
        }else this.setErrorMessage('Passwort darf nicht leer sein', {error: 'Bitte fülle alle Felder aus!'}  );
      }
    
  }
  );
  }

  async resetPassword() {
      this.route.params.subscribe(async params => {
        const url = environment.baseUrl + '/resetPassword/' + params['token'] + '/';
        const data = {
          pw1: this.password,
          pw2: this.password2
        };
        let response = await lastValueFrom(this.http.post(url, data));
        if((response as any).message === 'Passwort stimmt nicht mit Passwort2 überein!') {
          this.setErrorMessage('Passwort stimmt nicht mit Passwort2 überein!', response);
        } else {
          this.setErrorMessage('Passwort erfolgreich geändert! Du wirst zum Login weitergeleitet', response);
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
        }
      });
    
  }
  setErrorMessage(message: string, error: any) {
    this.login_failed = true;
    this.fail_message = error.error;
    this.message = message;
    this.resetErrorMessage();
  }

  resetErrorMessage() {
    setTimeout(() => {

      this.login_failed = false;
      this.fail_message = '';
      this.message = '';
      this.send = false;
      const passwordField = document.getElementById('passwordField') as HTMLInputElement;
      passwordField.value = '';
      const passwordField2 = document.getElementById('passwordField2') as HTMLInputElement;
      passwordField2.value = '';
    }, 3000);

  }
}
