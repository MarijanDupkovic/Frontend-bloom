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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, HttpClientModule, UserFeedBackComponent, NgIf],
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
  errorSubscription: Subscription = new Subscription;
  errorMessage: string = '';

  constructor(private errorService: UserfeedbackService, private metaTagService: Meta, private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Kostenloser Bildschirmrekorder für PC und Mac. Mit captureVue kannst du deinen Bildschirm aufnehmen, Videos erstellen und mit anderen teilen.'
    });
    this.errorSubscription = this.errorService.errorMessage$.subscribe((error: any) => {
      this.errorMessage = error;
      this.message = error;
    });
  }

  ngOnDestroy() {
    this.errorSubscription.unsubscribe();
  }

  async login() {
    this.send = true;
    try {
      await this.authService.loginWithUsernameAndPassword(this.username, this.password);
      this.router.navigateByUrl('/site/library');
    } catch (error: any) {
      await this.errorService.handleError(error);
      this.send = false;
    }
  }

  togglePWField(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.hide = !this.hide;
  }

  @HostListener('document:keydown.enter', ['$event'])
  async handleEnterKey(event: KeyboardEvent) {
    event.preventDefault();
    if (this.password && this.username) await this.login()
  }

  private handleError(error: any) {
    this.errorService.handleError(error);
  }
}
