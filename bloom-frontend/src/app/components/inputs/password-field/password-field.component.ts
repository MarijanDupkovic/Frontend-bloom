import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-password-field',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './password-field.component.html',
  styleUrl: './password-field.component.scss'
})
export class PasswordFieldComponent {
  @Input() placeholder: string = 'Enter your password';
  @Input() name: string = 'password';
  @Input() id: string = 'passwordField';
  @Input() model: any;
  @Input() hide: boolean = true;
  @Output() valueChange = new EventEmitter<any>();


  togglePWField(event: Event) {
    event.preventDefault();
    this.hide = !this.hide;
  }

  onValueChange(event: any) {
    this.valueChange.emit(event.target.value);
  }
}
