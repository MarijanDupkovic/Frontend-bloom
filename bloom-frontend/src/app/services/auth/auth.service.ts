import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environtments/environtment';

@Injectable({
  providedIn: 'root',
})


export class AuthService {
  constructor(private http: HttpClient, private router: Router) { }

  public loginWithEmailandPassword(email: string, password: string) {
    const url = environment.baseUrl + '/login/';
    const body = {
      "email": email,
      "password": password
    };
    return lastValueFrom(this.http.post(url, body));
  }

  public logout() {
    const url = environment.baseUrl + '/logout/' + localStorage.getItem('token');
    lastValueFrom(this.http.get(url));
    localStorage.removeItem('token');
    if (!this.isAuthenticated()) {
      this.router.navigateByUrl('/login');
    }
  }
 
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token !== null;
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
}
