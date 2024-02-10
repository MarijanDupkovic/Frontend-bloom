import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-post-app',
  standalone: true,
  imports: [RouterOutlet,],
  providers: [RouterOutlet],
  templateUrl: './post-app.component.html',
  styleUrl: './post-app.component.scss'
})
export class PostAppComponent {

}
