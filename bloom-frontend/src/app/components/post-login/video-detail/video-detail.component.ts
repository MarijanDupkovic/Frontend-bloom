import { Component, Input, OnInit } from '@angular/core';
import { PublicVideoComponent } from '../../public-video/public-video.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
@Component({
  selector: 'app-video-detail',
  standalone: true,
  imports: [PublicVideoComponent,CommonModule,FormsModule],
  providers: [],
  templateUrl: './video-detail.component.html',
  styleUrl: './video-detail.component.scss'
})
export class VideoDetailComponent implements OnInit{
  hide: boolean = true;
  link: string = '';
  id: string = '';

  constructor(private route: ActivatedRoute,private clipboard: Clipboard) {
  }

  async ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.id = params['str'];
      //#TODO: url anpassen
      this.link = 'http://localhost:4200/public-video/' + this.id;
    });

  }

  copyLink() {
    this.clipboard.copy(this.link);
  }

  togglePWField(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.hide = !this.hide;
  }
}
