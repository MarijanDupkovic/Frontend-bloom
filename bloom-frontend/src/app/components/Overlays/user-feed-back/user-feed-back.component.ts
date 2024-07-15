import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-feed-back',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-feed-back.component.html',
  styleUrl: './user-feed-back.component.scss'
})
export class UserFeedBackComponent {
  @Input() loginFailed: boolean = false;
  @Input() failMessage: string = '';
  @Input() message: string = '';
}
