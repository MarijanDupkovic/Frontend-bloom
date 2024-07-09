import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-confirmoverlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmoverlay.component.html',
  styleUrl: './confirmoverlay.component.scss'
})
export class ConfirmoverlayComponent {

  isVisible = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  show() {
    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
  }

  confirmDelete() {
    this.confirm.emit();
    this.hide();
  }

  cancelDelete() {
    this.cancel.emit();
    this.hide();
  }
}
