import { Injectable } from '@angular/core';
import { environment } from '../../../environtments/environtment';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private profilePicture = new BehaviorSubject<String>('');
  profilePicture$ = this.profilePicture.asObservable();

  constructor(private http: HttpClient) { }

 public async getUserData(path: string){
    const url = environment.baseUrl + path;
    const headers = new HttpHeaders().set('Authorization', `token ${localStorage.getItem('token')}`);
    return lastValueFrom(this.http.get(url, { headers })).then((resp: any) => {
      this.profilePicture.next(resp[0]['profile_picture']);
      return resp;

    });
  }

  changeUserData(path: string, bodyData:any,uid: string){
    const url = environment.baseUrl + path + '/' + uid + '/';
    const headers = new HttpHeaders().set('Authorization', `token ${localStorage.getItem('token')}`);
    const body = bodyData;
    return lastValueFrom(this.http.put(url, body, { headers }));
  }

  changeProfilePicture(path:string,picture:any){
    const headers = new HttpHeaders().set('Authorization', `token ${localStorage.getItem('token')}`);

    const url = environment.baseUrl + path + '/' + localStorage.getItem('token') + '/';

    return lastValueFrom(this.http.put(url, picture, { headers }));
  }



}
