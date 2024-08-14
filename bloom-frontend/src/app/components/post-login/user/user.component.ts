import { MatIconModule } from '@angular/material/icon';
import { AfterViewInit, Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { UserService } from '../../../services/profile/user.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environtments/environtment';
import { ConfirmoverlayComponent } from '../../Overlays/confirmoverlay/confirmoverlay.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule,RouterLink,MatIconModule,ConfirmoverlayComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements AfterViewInit {
  profileImg = 'https://www.w3schools.com/howto/img_avatar.png';
  public user: any;
  hovering = false;
  private isBrowser: boolean;
  active = 'userData';
  @ViewChild('fileInput') fileInput: any;
  @ViewChild(ConfirmoverlayComponent)
  confirmOverlay!: ConfirmoverlayComponent;
  constructor(private userService: UserService,@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
   }

  async ngAfterViewInit() {
    this.getUserData();
  }



  showOverlay() {
    this.confirmOverlay.show();
  }

  async getUserData() {
    let url = '';
    await this.userService.getUserData('/user').then((data: any) => {
      if (data[0].profile_picture) {
        let splitted = data[0].profile_picture.split('/');
        url = splitted[3] + '/' + splitted[4] + '/' + splitted[5] + '/';
        this.profileImg = environment.baseUrl + '/' + url;
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

  async deleteUser(){
    try{
      let deleResponse = await this.userService.deleteUser();
      if(this.isBrowser &&  deleResponse){
        localStorage.clear();
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }

  }

  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

}
