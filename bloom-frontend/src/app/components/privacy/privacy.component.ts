import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss'
})
export class PrivacyComponent {

  constructor(private metaTagService: Meta) {}

  ngOnInit() {
    this.metaTagService.updateTag(
      { name: 'description', content: 'Kostenloser Bildschirmrekorder für PC und Mac. Mit captureVue kannst du deinen Bildschirm aufnehmen, Videos erstellen und mit anderen teilen.' }
    );
  }
}
