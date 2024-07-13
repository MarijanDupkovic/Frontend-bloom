import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../../services/profile/user.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';
import { environment } from '../../../../environtments/environtment';

@Component({
  selector: 'app-post-login',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './post-login.component.html',
  styleUrl: './post-login.component.scss'
})
export class PostLoginComponent {
  isOpen: boolean = false;
  @Input() active: boolean = false;
  profilePicture: string = '';
  private subscription: Subscription | undefined;
  dropdownMenuOpened = false;
  @ViewChild('dropdownMenu')
  dropdownMenu!: ElementRef<any>;
  constructor(private user: UserService, private auth: AuthService, private route: Router) { }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.dropdownMenu.nativeElement.contains(event.target)) {
      this.dropdownMenuOpened = false;
    }
  }

  ngOnInit() {
    this.user.getUserData('/user').then((resp: any) => {
      this.subscription = this.user.profilePicture$.subscribe((value: any) => {
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
      return environment.baseUrl + '/' + url;
    }
    return 'https://www.w3schools.com/howto/img_avatar.png';
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  async logout() {
    try {
      await this.auth.logout();
      this.route.navigate(['/']).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.log(error);
    }
  }
}
