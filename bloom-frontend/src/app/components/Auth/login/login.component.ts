import { CommonModule, NgIf } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { UserFeedBackComponent } from '../../Overlays/user-feed-back/user-feed-back.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, HttpClientModule, UserFeedBackComponent, NgIf],
  providers: [ ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  hide: boolean = true;
  send: boolean = false;
  signedIn: boolean = false;
  loginFailed: boolean = false;
  failMessage: string = '';
  message = ``;

  constructor(private metaTagService: Meta,private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.metaTagService.updateTag(
      { name: 'description', content: 'Kostenloser Bildschirmrekorder für PC und Mac. Mit captureVue kannst du deinen Bildschirm aufnehmen, Videos erstellen und mit anderen teilen.' }
    );
  }

  async login() {
    this.send = true;
    try {
      await this.authService.loginWithUsernameAndPassword(this.username, this.password).then(() => {
        this.router.navigateByUrl('/site/library');
      });
    } catch (error:any){
      if (error.status == 403) this.setErrorMessage(' Bitte bestätige zuerst deine Emailadresse.', error);
      else if (error.status == 401) this.setErrorMessage(' Benutzername oder Password ist nicht korrekt.', error);
      else if (error.status == 404) this.setErrorMessage('Benutzername oder Password ist nicht korrekt.', error);
    }
  }

  togglePWField(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.hide = !this.hide;
  }

  setErrorMessage(message: string, error: any) {
    this.loginFailed = true;
    this.failMessage = error.error;
    this.message = message;
    this.resetErrorMessage();
  }

  resetErrorMessage() {
    setTimeout(() => {
      if (this.loginFailed) {
        const passwordField = document.getElementById('passwordField') as HTMLInputElement;
        passwordField.value = '';
      }
      this.loginFailed = false;
      this.failMessage = '';
      this.message = '';
      this.send = false;

    }, 3000);
  }

  @HostListener('document:keydown.enter', ['$event'])
  async handleEnterKey(event: KeyboardEvent) {
    event.preventDefault();
    if (this.password !== '' && this.username !== '') {
      await this.login();
    } else {
      this.setErrorMessage('Bitte fülle alle Felder aus!', { error: 'Bitte fülle alle Felder aus!' });
    }
  }
}
