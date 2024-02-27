import { MatIconModule } from '@angular/material/icon';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { UserService } from '../../../services/profile/user.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule,RouterLink,MatIconModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements AfterViewInit {
  profileImg = 'https://www.w3schools.com/howto/img_avatar.png';
  public user: any;
  hovering = false;
  @ViewChild('fileInput') fileInput: any;
  constructor(private userService: UserService) { }

  async ngAfterViewInit() {
    this.getUserData();
  }

  async getUserData() {
    let url = '';
    await this.userService.getUserData('/user').then((data: any) => {
      if (data[0].profile_picture) {
        let splitted = data[0].profile_picture.split('/');
        url = splitted[3] + '/' + splitted[4] + '/' + splitted[5] + '/';
        this.profileImg = 'https://be.recsync.app/' + url;
      }
      this.user = data;
    });

  }

  handleFileInput() {

    if (this.user[0]) {
      const file = this.fileInput.nativeElement.files[0];
      const formData: FormData = new FormData();
      formData.append('profile_picture', file, file.name);
      this.userService.changeProfilePicture('/changePicture', formData)
      .then(() => {
        this.getUserData();
      });
    }
  }

  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

}
