import { UserfeedbackService } from './../../../services/userFeedback/userfeedback.service';
import { CommonModule, NgIf } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { UserFeedBackComponent } from '../../Overlays/user-feed-back/user-feed-back.component';
import { Subscription } from 'rxjs';
import { LoginFormComponent } from '../login-form/login-form.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, HttpClientModule, NgIf, LoginFormComponent],
  providers: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  hide: boolean = true;
  send: boolean = false;
  message = ``;


  constructor(private errorService: UserfeedbackService, private metaTagService: Meta, private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Kostenloser Bildschirmrekorder für PC und Mac. Mit captureVue kannst du deinen Bildschirm aufnehmen, Videos erstellen und mit anderen teilen.'
    });

  }





  // togglePWField(e: Event) {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   this.hide = !this.hide;
  // }

  // @HostListener('document:keydown.enter', ['$event'])
  // async handleEnterKey(event: KeyboardEvent) {
  //   event.preventDefault();
  //   if (this.password && this.username) await this.login()
  // }


}
