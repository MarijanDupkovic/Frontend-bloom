import { Component } from '@angular/core';
import { UserService } from '../../../services/profile/user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  profileImg = 'https://www.w3schools.com/howto/img_avatar.png';
  user: any;
  constructor(private userService: UserService) { }

  async ngOnInit() {
    this.getUserData();
  }

  async getUserData() {
    this.user = await this.userService.getUserData('/user');
    console.log(this.user);
    
  }
}
