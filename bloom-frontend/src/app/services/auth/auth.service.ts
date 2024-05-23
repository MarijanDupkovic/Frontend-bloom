import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, lastValueFrom } from 'rxjs';
import { environment } from '../../../environtments/environtment';
import {  FormGroup } from '@angular/forms';

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

  public signUp(signUpForm:FormGroup) {
    const url = environment.baseUrl + '/register/';

    return lastValueFrom(this.http.post(url, signUpForm.value));
  }

}
