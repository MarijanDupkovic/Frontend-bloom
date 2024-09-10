import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.scss'
})
export class InputFieldComponent {
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() name: string = '';
  @Input() id: string = '';
  @Input() model: any;
  @Output() valueChange = new EventEmitter<any>();

  onValueChange(event: any) {
    this.valueChange.emit(event.target.value);
  }
}
