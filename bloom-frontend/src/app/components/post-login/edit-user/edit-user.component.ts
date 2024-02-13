import { Component } from '@angular/core';
import { UserService } from '../../../services/profile/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule,FormsModule],
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
  constructor(private userService: UserService) { }
  
  async ngOnInit() {
    this.getData();
  }


  async getData() {
    this.user = await this.userService.getUserData('/user');
    this.username = this.user[0].username;
    this.email = this.user[0].email;

  }

  changeData() {
    this.send = true;
    let resp: any;
    try {
    resp = this.userService.changeUserData('/user', this.username, this.email, this.user[0].id);
    }catch(e){
      let error: any = e;
      this.setErrorMessage('Ein Fehler ist aufgetreten.', error);
    }


    setTimeout(() => {
      this.send = false;
    }, 2000);
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
     
    }, 3000);
  }
  
}
