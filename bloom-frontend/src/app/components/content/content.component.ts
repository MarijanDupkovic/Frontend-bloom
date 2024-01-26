import { Component } from '@angular/core';
import { TopSectionComponent } from './top-section/top-section.component';
import { MiddleSectionComponent } from './middle-section/middle-section.component';
import { BottomSectionComponent } from './bottom-section/bottom-section.component';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [TopSectionComponent,MiddleSectionComponent,BottomSectionComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentComponent {

}
