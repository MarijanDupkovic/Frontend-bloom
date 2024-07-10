import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { environment } from '../../../environtments/environtment';
import { FormGroup } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedIn.asObservable();
  private isBrowser: boolean;
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loggedIn.next(this.isAuthenticated());
  }

  public async loginWithUsernameAndPassword(username: string, password: string) {
    const url = environment.baseUrl + '/login/';
    const body = {
      "username": username,
      "password": password
    };

    return lastValueFrom(this.http.post(url, body)).then((resp: any) => {
      if (this.isBrowser && resp && resp['token']) {
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
    let token = '';
    if (this.isBrowser) {
      token = localStorage.getItem('token')!;
    }
    const url = environment.baseUrl + '/logout/' + token + '/';
    return await lastValueFrom(this.http.get(url)).then((resp: any) => {
      if (this.isBrowser) {
        localStorage.removeItem('token');

      }
      this.changeSignInState(false);
    });
  }

  public isAuthenticated(): boolean {
    if (this.isBrowser) {
      const token = localStorage.getItem('token');
      if (token === null) {
        return false;
      }
      return true;
    }
    return false;
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
