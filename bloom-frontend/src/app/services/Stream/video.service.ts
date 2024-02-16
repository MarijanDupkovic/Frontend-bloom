import { Injectable } from '@angular/core';
import { environment } from '../../../environtments/environtment';
import { lastValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(private http: HttpClient) { }

  uploadVideo(formData: FormData) {
    const url = environment.baseUrl + '/videos/';
    // const body = {
    //   "video_file": video
    // };
    const headers = new HttpHeaders().set('Authorization', `token ${localStorage.getItem('token')}`);

    let upload$ = this.http.post(url, formData, { headers });

    return lastValueFrom(upload$);

  }
}
