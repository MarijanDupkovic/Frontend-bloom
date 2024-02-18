import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../../services/Stream/video.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environtments/environtment';

@Component({
  selector: 'app-public-video',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './public-video.component.html',
  styleUrl: './public-video.component.scss'
})
export class PublicVideoComponent implements OnInit {

  id: string = '';
  @Input() video: any;
  constructor(private route: ActivatedRoute, private videos: VideoService) {
  }

  async ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.id = params['str'];
    });
    this.video = await this.videos.getUserVideos();
    this.video = this.video.filter((video: any) => video.title === this.id);
    this.video = this.video[0];
  }

  async getVideo() {
  }

  convertLink(link: string) {
    let splitted_link = link.split('/');
    let url = environment.baseUrl + '/' + splitted_link[3] + '/' + splitted_link[4] + '/' + splitted_link[5];
    return url;
   }

}
