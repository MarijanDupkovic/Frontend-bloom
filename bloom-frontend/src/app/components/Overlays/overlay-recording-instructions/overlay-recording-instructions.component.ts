import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-overlay-recording-instructions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overlay-recording-instructions.component.html',
  styleUrl: './overlay-recording-instructions.component.scss'
})
export class OverlayRecordingInstructionsComponent {
  isVisible = false;
  @Output() close = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  hide() {
    this.isVisible = false;
  }

  show() {
    this.isVisible = true;
  }

  closeHelpMenu() {
    this.close.emit();
    this.hide();
  }
}
