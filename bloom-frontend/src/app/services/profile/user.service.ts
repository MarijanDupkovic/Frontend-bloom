import { Injectable } from '@angular/core';
import { environment } from '../../../environtments/environtment';
import { lastValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserData(path: string){
    const url = environment.baseUrl + path;
    const headers = new HttpHeaders().set('Authorization', `token ${localStorage.getItem('token')}`);
    return lastValueFrom(this.http.get(url, { headers }));
  }

  changeUserData(path: string, username: string, email: string,uid: string){
    const url = environment.baseUrl + path + '/' + uid + '/';
    const headers = new HttpHeaders().set('Authorization', `token ${localStorage.getItem('token')}`);
    const body = { "username":username,"email": email};
    return lastValueFrom(this.http.put(url, body, { headers }));
  }
}
