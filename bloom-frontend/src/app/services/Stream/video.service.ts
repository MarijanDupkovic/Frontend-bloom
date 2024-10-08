import { Injectable } from '@angular/core';
import { environment } from '../../../environtments/environtment';
import { lastValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../profile/user.service';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  userVideos: any;
  userData: any;
  constructor(private http: HttpClient, private user: UserService) {
  }

  async uploadVideo(formData: FormData) {
    const url = environment.baseUrl + '/videos/';
    const headers = new HttpHeaders().set('Authorization', `token ${localStorage.getItem('token')}`);
    let upload = this.http.post(url, formData, { headers });
    return await lastValueFrom(upload);
  }

  async getUserVideos() {
    this.userData = await this.user.getUserData('/user');
    this.userVideos = this.userData[0].videoitem_set;

    return this.userVideos;
  }

  getVideoStreamURL(token: string) {
    return `${environment.baseUrl}/video/${token}/`;
  }

}
