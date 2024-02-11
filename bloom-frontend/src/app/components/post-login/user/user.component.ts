import { Component } from '@angular/core';
import { UserService } from '../../../services/profile/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  profileImg = 'https://www.w3schools.com/howto/img_avatar.png';
  public user: any;
  constructor(private userService: UserService) { }

  async ngOnInit() {
    this.getUserData();
  }

  async getUserData() {
    this.user = await this.userService.getUserData('/user');
    
  }
}
