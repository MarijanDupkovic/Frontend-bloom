import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pre-login',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './pre-login.component.html',
  styleUrl: './pre-login.component.scss'
})
export class PreLoginComponent {
  isOpen: boolean = false;
  @Input() active:boolean = false;

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }
}
