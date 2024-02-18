import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-login',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './post-login.component.html',
  styleUrl: './post-login.component.scss'
})
export class PostLoginComponent {
  isOpen: boolean = false;
  @Input() active:boolean = false;

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }
}
