import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, lastValueFrom } from 'rxjs';
import { environment } from '../../../environtments/environtment';

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
    return lastValueFrom(this.http.post(url, body)).then((resp: any) => { // Explicitly define the type of resp as any
      if (resp && resp['token']) {
        localStorage.setItem('token', resp['token']);

        this.changeSignInState(true);
      }
    }
    );
  }
  public changeSignInState(bool: boolean) {
    this.loggedIn.next(bool);
    console.log('waaaas', this.loggedIn$)

  }
  public async logout() {
    console.log('logout');
    const url = environment.baseUrl + '/logout/' + localStorage.getItem('token');
    await lastValueFrom(this.http.get(url)).then((resp: any) => {
      localStorage.removeItem('token');
      this.changeSignInState(false);

      console.log('logged out', this.loggedIn$);

    });

  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (token === null) {
      return false;
    }
    return true;
  }

  public signUp(email: string, password: string, password2: string, username: string, firstName: string, lastName: string, street: string, zipCode: string, city: string, country: string) {
    const url = environment.baseUrl + '/register/';
    const body = {
      "email": email,
      "first_name": firstName,
      "last_name": lastName,
      "password": password,
      "password2": password2,
      "username": username,
      "street": street,
      "zip_code": zipCode,
      "city": city,
      "country": country
    };
    return lastValueFrom(this.http.post(url, body));
  }




  //  public get isLoggedIn() {
  //   return this.loggedIn.asObservable();
  // }
}
