import { UserService } from './../../../services/profile/user.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserFeedBackComponent } from '../../Overlays/user-feed-back/user-feed-back.component';
import { UserfeedbackService } from '../../../services/userFeedback/userfeedback.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reset-pw',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, RouterLink, UserFeedBackComponent],
  templateUrl: './reset-pw.component.html',
  styleUrl: './reset-pw.component.scss'
})
export class ResetPwComponent implements OnInit {
  password: string = '';
  password2: string = '';
  hide: boolean = true;
  hide2: boolean = true;
  send: boolean = false;
  message = ``;
  errorSubscription: Subscription = new Subscription;
  errorMessage: string = '';

  constructor(private userfeedback: UserfeedbackService, private route: ActivatedRoute, private http: HttpClient, private userService: UserService) {
    this.errorSubscription = this.userfeedback.errorMessage$.subscribe((error: any) => {
      this.errorMessage = error;
      this.message = error;
    });
  }

  ngOnInit() {

    this.addEnterListener();
  }

  togglePWField(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.hide = !this.hide;
  }
  togglePWField2(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.hide2 = !this.hide2;
  }

  addEnterListener() {
    addEventListener('keydown', (e: KeyboardEvent) => {

      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        this.resetPassword();
      }
    }
    );
  }

  async resetPassword() {
    const token = this.route.snapshot.paramMap.get('token');
    const url = '/resetPassword/' + token + '/';

    try {
      await this.userService.resetPassword(url, { pw1: this.password, pw2: this.password2 });
      setTimeout(() => {
        window.location.href = '/signin';
      }, 3000);

    } catch (error: any) {
      this.userfeedback.handleError(error);
      this.clearPasswordFields();
    }
  }

  private clearPasswordFields(): void {
    this.password = '';
    this.password2 = '';
  }
}
