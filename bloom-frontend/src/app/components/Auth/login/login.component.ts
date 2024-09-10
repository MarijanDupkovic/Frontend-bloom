import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { LoginFormComponent } from '../login-form/login-form.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, LoginFormComponent],
  providers: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private metaTagService: Meta) { }

  ngOnInit() {
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Kostenloser Bildschirmrekorder für PC und Mac. Mit captureVue kannst du deinen Bildschirm aufnehmen, Videos erstellen und mit anderen teilen.'
    });
  }
}
