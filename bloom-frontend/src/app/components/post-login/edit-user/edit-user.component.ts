import { Component } from '@angular/core';
import { UserService } from '../../../services/profile/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent {
  send: boolean = false;
  username: string = '';
  email: string = '';
  user: any;
  failed: boolean = false;
  fail_message: string = '';
  message = ``;
  location: any;
  constructor(private userService: UserService) { }

  async ngOnInit() {
    this.getData();
  }

  async getData() {
    this.user = await this.userService.getUserData('/user');
    this.username = this.user[0].username;
    this.email = this.user[0].email;
  }

  async changeData() {
    this.send = true;
    let resp: any;
    resp = await this.userService.changeUserData('/user', this.username, this.email, this.user[0].id).then((data: any) => {
      this.setErrorMessage('Daten erfolgreich geändert', 'Daten erfolgreich geändert');

    }).catch((err) => {
      if (err.status == 404) {
        this.setErrorMessage(' Benutzer mit dieser Emailadresse nicht vorhanden.', err);
      }
      else if (err.status == 400) {
        this.setErrorMessage(' Bitte gib eine Emailadresse ein.', err);
      }
    });
  }

  back() {
    window.history.back();
  }

  setErrorMessage(message: string, error: any) {
    this.failed = true;
    this.fail_message = error.error;
    this.message = message;
    this.resetErrorMessage();
  }

  resetErrorMessage() {
    setTimeout(() => {
      this.failed = false;
      this.fail_message = '';
      this.message = '';
      this.send = false;
      this.back();
    }, 3000);
  }

}
