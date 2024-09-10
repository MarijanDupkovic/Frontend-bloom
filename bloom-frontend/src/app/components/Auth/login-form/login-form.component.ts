import { Component, HostListener, Input } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { UserfeedbackService } from '../../../services/userFeedback/userfeedback.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { CommonModule } from '@angular/common';
import { UserFeedBackComponent } from '../../Overlays/user-feed-back/user-feed-back.component';
import { FormsModule } from '@angular/forms';
import { SubmitButtonComponent } from '../../buttons/submit-button/submit-button.component';
import { InputFieldComponent } from '../../inputs/input-field/input-field.component';
import { PasswordFieldComponent } from '../../inputs/password-field/password-field.component';
import { RedirectLinksComponent } from '../../redirect/redirect-links/redirect-links.component';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule, CommonModule, UserFeedBackComponent, InputFieldComponent, PasswordFieldComponent, SubmitButtonComponent, RedirectLinksComponent],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
  @Input() username: string = '';
  @Input() password: string = '';
  @Input() hide: boolean = true;
  @Input() send: boolean = false;
  @Input() message: string = '';
  errorSubscription: Subscription = new Subscription;
  errorMessage: string = '';
  constructor(private errorService: UserfeedbackService, private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.errorSubscription = this.errorService.errorMessage$.subscribe((error: any) => {
      this.errorMessage = error;
      this.message = error;
    });
  }

  ngOnDestroy() {
    this.errorSubscription.unsubscribe();
  }

  togglePWField(event: Event) {
    event.preventDefault();
    this.hide = !this.hide;
  }

  async login() {
    this.send = true;
    try {
      debugger
      await this.authService.loginWithUsernameAndPassword(this.username, this.password);
      this.router.navigateByUrl('/site/library');
    } catch (error: any) {
      await this.errorService.handleError(error);
      this.send = false;
    }
  }

  onUsernameChange(newUsername: string) {
    this.username = newUsername;
  }

  onPasswordChange(newPassword: string) {
    this.password = newPassword;
  }

  @HostListener('document:keydown.enter', ['$event'])
  async handleEnterKey(event: KeyboardEvent) {
    event.preventDefault();
    if (this.password && this.username) await this.login()
  }

}
