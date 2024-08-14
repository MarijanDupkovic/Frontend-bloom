import { Component } from '@angular/core';
import { UserService } from '../../../services/profile/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserFeedBackComponent } from '../../Overlays/user-feed-back/user-feed-back.component';

interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  street: string;
  zip_code: string;
  city: string;
  country: string;
}@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule, UserFeedBackComponent],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent {
  send: boolean = false;
  isLoading: boolean = false;
  user: User = { id: '', username: '', email: '', first_name: '', last_name: '', street: '', zip_code: '', city: '', country: '' };
  loginFailed: boolean = false;
  failMessage: string = '';
  message: string = ``;
  infoType: string = 'userData';
  success: boolean = false;
  constructor(private userService: UserService, private route: ActivatedRoute) { }

  async ngOnInit() {
    this.fetchUserData();
    this.observeRouteChanges();
  }

  private observeRouteChanges(): void {
    this.route.queryParams.subscribe(params => {
      this.infoType = params['info'];
    });
  }

  private async fetchUserData(): Promise<void> {
    try {
      const userData = await this.userService.getUserData('/user');
      const { id, username, email, first_name, last_name, street, zip_code, city, country } = userData[0];
      this.user = { id, username, email, first_name, last_name, street, zip_code, city, country };
    } catch (error) {
      console.error('Fehler beim Abrufen der Benutzerdaten:', error);
    }
  }

  async updateUserData(): Promise<void> {
    this.isLoading = true;
    try {
      console.log(this.user);
      await this.userService.changeUserData('/user', this.user, this.user.id);
      this.success = true;
      this.setErrorMessage('Daten erfolgreich geändert', 'Daten erfolgreich geändert');
    } catch (error) {
      this.handleUpdateError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private handleUpdateError(error: any): void {
    this.loginFailed = true;
    this.failMessage = error.error;
    switch (error.status) {
      case 404:
        this.message = 'Benutzer mit dieser Emailadresse nicht vorhanden.';
        break;
      case 400:
        this.message = 'Bitte gib eine Emailadresse ein.';
        break;
      default:
        this.message = 'Ein unbekannter Fehler ist aufgetreten.';
    }
    this.resetErrorMessage();
  }

  back() {
    window.history.back();
  }

  setErrorMessage(message: string, error: any) {
    this.loginFailed = true;
    this.failMessage = error.error;
    this.message = message;
    this.resetErrorMessage();
  }

  resetErrorMessage() {
    setTimeout(() => {
      this.loginFailed = false;
      this.failMessage = '';
      this.message = '';
      this.send = false;
      this.back();
    }, 3000);
  }

}
