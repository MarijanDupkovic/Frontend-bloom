import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top-section',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './top-section.component.html',
  styleUrl: './top-section.component.scss'
})
export class TopSectionComponent {
  videos = [
    "assets/videos/video1.mp4",
    "assets/videos/video2.mp4",
    "assets/videos/video3.mp4"
  ];
  currentVideoIndex = 0;

  nextVideo() {
    this.currentVideoIndex = (this.currentVideoIndex + 1) % this.videos.length;
  }
}
