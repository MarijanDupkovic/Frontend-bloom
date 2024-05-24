import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { VideoService } from '../../../services/Stream/video.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environtments/environtment';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss'
})
export class LibraryComponent {
  @Input() videos = [] as any;
  all:boolean = false;



  constructor(private video:VideoService) {
   }

   async ngOnInit() {
      this.videos = await this.getVideos();


    }

   async getVideos() {
     return await this.video.getUserVideos();
   }

   toggleCategory(value: boolean) {
      this.all = value;

    }

   convertLink(link: string) {
    let splitted_link = link.split('/');
    let url = environment.baseUrl + '/' + splitted_link[3] + '/' + splitted_link[4] + '/' + splitted_link[5];
    return url;
   }
}
