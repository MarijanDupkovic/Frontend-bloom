import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [],
  templateUrl: './legal.component.html',
  styleUrl: './legal.component.scss'
})
export class LegalComponent {
  constructor(private metaTagService: Meta) {}

  ngOnInit() {
    this.metaTagService.updateTag(
      { name: 'description', content: 'Kostenloser Bildschirmrekorder für PC und Mac. Mit captureVue kannst du deinen Bildschirm aufnehmen, Videos erstellen und mit anderen teilen.' }
    );
  }

}
