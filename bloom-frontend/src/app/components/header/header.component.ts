import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PreLoginComponent } from './pre-login/pre-login.component';
import { PostLoginComponent } from './post-login/post-login.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [PreLoginComponent, PostLoginComponent,CommonModule],
  providers: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  url: any = '';
  @Input() loggedIn: boolean = false;
  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => { // Fix: Add type assertion to NavigationEnd
      this.url = event.url;
      this.url = this.url.split('/');

      this.url.forEach((element: any) => {
        if (element === 'site') this.loggedIn = true;
      }

      )
    });
  }
}
