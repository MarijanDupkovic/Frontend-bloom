import { CommonModule, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnChanges, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { data } from '@tensorflow/tfjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  url: any = '';
  isOpen: boolean = false;
  private subscription: Subscription | undefined;
  @Input() active: boolean = false;
  signedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.subscription = this.authService.loggedIn$.subscribe((value: boolean) => { // Specify the type argument as boolean
      if (!value) {
        this.signedIn = value;
      } else {
        this.signedIn = value;

      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  async logout() {
    await this.authService.logout().then(() => {
      this.router.navigateByUrl('');
    });

  }

}
