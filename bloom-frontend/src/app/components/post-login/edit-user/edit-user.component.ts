import { Component } from '@angular/core';
import { UserService } from '../../../services/profile/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface body { "username": '', "email": '', "first_name": '', "last_name": '', "street": '', "zip_code": '', "city": '', "country": '' };
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
  firstName: string = '';
  lastName: string = '';
  street: string = '';
  zipCode: string = '';
  city: string = '';
  country: string = '';
  email: string = '';
  user: any;
  failed: boolean = false;
  fail_message: string = '';
  message = ``;
  location: any;
  infoType: string = 'userData';
  success: boolean = false;
  constructor(private userService: UserService,private route: ActivatedRoute) { }

  async ngOnInit() {
    this.getData();
    this.route.queryParams.subscribe(params => {
      this.infoType = params['info'];
    });
  }

  async getData() {
    this.user = await this.userService.getUserData('/user');
    this.username = this.user[0].username;
    this.email = this.user[0].email;
    this.firstName = this.user[0].first_name;
    this.lastName = this.user[0].last_name;
    this.street = this.user[0].street;
    this.zipCode = this.user[0].zip_code;
    this.city = this.user[0].city;
    this.country = this.user[0].country;
  }



  async changeData() {
    this.send = true;
    let body = {
      "username": this.username,
      "email": this.email,
      "first_name": this.firstName,
      "last_name": this.lastName,
      "street": this.street,
      "zip_code": this.zipCode,
      "city": this.city,
      "country": this.country
    }
    await this.userService.changeUserData('/user', body, this.user[0].id).then((data: any) => {
      this.success = true;
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
