import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { environment } from '../../../environtments/environtment';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedIn.asObservable();
  constructor(private http: HttpClient) {
    this.loggedIn.next(this.isAuthenticated());
  }

  public async loginWithEmailandPassword(email: string, password: string) {
    const url = environment.baseUrl + '/login/';
    const body = {
      "email": email,
      "password": password
    };

    return lastValueFrom(this.http.post(url, body)).then((resp: any) => {
      if (resp && resp['token']) {
        localStorage.setItem('token', resp['token']);
        this.changeSignInState(true);
      }
    }
    );
  }

  public changeSignInState(bool: boolean) {
    this.loggedIn.next(bool);
  }

  public async logout() {
    const url = environment.baseUrl + '/logout/' + localStorage.getItem('token');
    return await lastValueFrom(this.http.get(url)).then((resp: any) => {
      localStorage.removeItem('token');
      this.changeSignInState(false);
    });
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (token === null) {
      return false;
    }
    return true;
  }

  public signUp(signUpForm: FormGroup) {
    const url = environment.baseUrl + '/register/';
    const body = {
      "email": signUpForm.value.email,
      "password": signUpForm.value.password,
      "password2": signUpForm.value.password2,
      "username": signUpForm.value.username,
      "first_name": signUpForm.value.firstName,
      "last_name": signUpForm.value.lastName,
      "street": signUpForm.value.street,
      "zip_code": signUpForm.value.zipCode,
      "city": signUpForm.value.city,
      "country": signUpForm.value.country
    };
    return lastValueFrom(this.http.post(url, body));
  }
}
