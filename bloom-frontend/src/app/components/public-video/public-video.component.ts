import { Component, HostListener, Input, OnInit } from '@angular/core';
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
  private readonly aspectRatio: number = 16 / 9;
  private readonly referenceResolution: number = 1920;
  private readonly targetWidth: number = 1280;
  private readonly widthRatio: number = this.targetWidth / this.referenceResolution;
  id: string = '';
  @Input() video: any;

  canvasWidth: number = 1280;
  canvasHeight: number = 720;
  constructor(private route: ActivatedRoute, private videos: VideoService) {
    this.adjustCanvasSize();
  }

  async ngOnInit() {
    const token = this.route.snapshot.paramMap.get('str');
    if(token){
      this.video = this.videos.getVideoStreamURL(token);

    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.adjustCanvasSize();
  }

  adjustCanvasSize() {
    const screenWidth = window.innerWidth;
    this.canvasWidth = screenWidth * this.widthRatio;
    this.canvasHeight = this.canvasWidth / this.aspectRatio;
  }

  convertLink(link: string) {
    let splitted_link = link.split('/');
    let url = environment.baseUrl + '/' + splitted_link[3] + '/' + splitted_link[4] + '/' + splitted_link[5];
    return url;
   }

}
