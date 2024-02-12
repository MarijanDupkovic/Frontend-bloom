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

    this.userService.changeUserData('/user', this.username, this.email, this.user[0].id);

    setTimeout(() => {
      this.send = false;
    }, 2000);
  }

  
}
