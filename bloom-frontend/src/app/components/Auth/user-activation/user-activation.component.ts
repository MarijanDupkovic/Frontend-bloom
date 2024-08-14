import { UserfeedbackService } from './../../../services/userFeedback/userfeedback.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-user-activation',
  standalone: true,
  imports: [HttpClientModule],
  providers: [CommonModule, HttpClient],
  templateUrl: './user-activation.component.html',
  styleUrl: './user-activation.component.scss'
})
export class UserActivationComponent implements OnInit {
  errorSubscription: Subscription = new Subscription;
  errorMessage: string = '';

  message = ``;
  success: boolean = false;
  constructor(private route: ActivatedRoute, private auth: AuthService,private uf: UserfeedbackService) { }

  ngOnInit(): void {
    this.errorSubscription = this.uf.errorMessage$.subscribe((error: any) => {
      this.errorMessage = error;
      this.message = error;
    });

    this.activateUser();
  }

  async activateUser() {
    this.route.params.subscribe(async params => {
      const token = params['token'];
      try {
        await this.auth.activateUser(token);
        this.uf.handleError('User activation successful');
        setTimeout(() => window.location.href = '/', 2000);
      } catch (error) {
        this.uf.handleError('User activation failed');
      }
    });
  }

}
