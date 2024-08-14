import { Component } from '@angular/core';
import { TopSectionComponent } from './top-section/top-section.component';
import { MiddleSectionComponent } from './middle-section/middle-section.component';
import { BottomSectionComponent } from './bottom-section/bottom-section.component';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [TopSectionComponent,MiddleSectionComponent,BottomSectionComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentComponent {

  constructor(private metaTagService: Meta) {}

  ngOnInit() {
    this.metaTagService.updateTag(
      { name: 'description', content: 'Kostenloser Bildschirmrekorder für PC und Mac. Mit captureVue kannst du deinen Bildschirm aufnehmen, Videos erstellen und mit anderen teilen.' }
    );
  }

}
