import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environtments/environtment';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private profilePicture = new BehaviorSubject<String>('');
  profilePicture$ = this.profilePicture.asObservable();
  private isBrowser: boolean =false;
  constructor(private http: HttpClient,@Inject(PLATFORM_ID) private platformId: Object) {  this.isBrowser = isPlatformBrowser(this.platformId);
   }

   getToken() {
    return this.isBrowser ? localStorage.getItem('token') : '';
  }

 public async getUserData(path: string){
    const url = environment.baseUrl + path;
    const headers = new HttpHeaders().set('Authorization', `token ${this.getToken()}`);
    return lastValueFrom(this.http.get(url, { headers })).then((resp: any) => {
      this.profilePicture.next(resp[0]['profile_picture']);
      return resp;

    });
  }

  changeUserData(path: string, bodyData:any,uid: string){
    const url = environment.baseUrl + path + '/' + uid + '/';
    const headers = new HttpHeaders().set('Authorization', `token ${this.getToken()}`);
    const body = bodyData;

    return lastValueFrom(this.http.put(url, body, { headers }));
  }

  changeProfilePicture(path:string,picture:any){
    let token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `token ${token}`);
    const url = environment.baseUrl + path + '/' + token + '/';
    return lastValueFrom(this.http.put(url, picture, { headers }));
  }

  deleteUser(){
    const headers = new HttpHeaders().set('Authorization', `token ${this.getToken()}`);
    const url = environment.baseUrl + '/delete_user/' + this.getToken() + '/';
    return lastValueFrom(this.http.get(url, { headers }));
  }


}
