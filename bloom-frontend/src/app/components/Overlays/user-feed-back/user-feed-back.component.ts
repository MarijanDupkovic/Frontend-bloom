import { UserfeedbackService } from './../../../services/userFeedback/userfeedback.service';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { c } from 'vite/dist/node/types.d-aGj9QkWt';

@Component({
  selector: 'app-user-feed-back',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-feed-back.component.html',
  styleUrl: './user-feed-back.component.scss'
})
export class UserFeedBackComponent {
  @Input() failed: boolean = false;
  @Input() failMessage: string = '';
  @Input() message: string = '';

  constructor(private userFeedBack:UserfeedbackService) { }

  ngOnInit(): void {
    this.userFeedBack.failed$.subscribe((failed: boolean) => {
      this.failed = failed;
    });

    this.userFeedBack.errorMessage$.subscribe((failMessage: string) => {
      this.failMessage = failMessage;
    });
  }
}
