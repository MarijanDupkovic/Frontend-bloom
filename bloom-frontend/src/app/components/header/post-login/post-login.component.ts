import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../services/profile/user.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-post-login',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './post-login.component.html',
  styleUrl: './post-login.component.scss'
})
export class PostLoginComponent {
  isOpen: boolean = false;
  @Input() active: boolean = false;
  profilePicture: string = '';
  private subscription: Subscription | undefined;
  dropdownMenuOpened = false;
  constructor(private user: UserService,private auth:AuthService) { }
  ngOnInit() {
    this.user.getUserData('/user').then((resp: any) => {
      this.subscription = this.user.profilePicture$.subscribe((value: any) => { // Specify the type argument as boolean
        this.profilePicture = value;

      });
    });
  }
  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  convertLink(profilePicture: string) {
    if (profilePicture) {
      let splitted = profilePicture.split('/');
      let url = splitted[3] + '/' + splitted[4] + '/' + splitted[5] + '/';
      return 'https://be.recsync.app/' + url;
    }
    return 'https://www.w3schools.com/howto/img_avatar.png';

}

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  logout(){
    this.auth.logout();
  }
}
