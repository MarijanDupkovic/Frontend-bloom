import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Renderer2, RendererFactory2 } from '@angular/core';
@Component({
  selector: 'app-pre-login',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './pre-login.component.html',
  styleUrl: './pre-login.component.scss'
})
export class PreLoginComponent {
  isOpen: boolean = false;
  @Input() active:boolean = false;
  private renderer: Renderer2;
  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    } else {
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }
}
