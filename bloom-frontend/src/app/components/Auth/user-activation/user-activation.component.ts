import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environtments/environtment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-activation',
  standalone: true,
  imports: [HttpClientModule],
  providers: [CommonModule, HttpClient],
  templateUrl: './user-activation.component.html',
  styleUrl: './user-activation.component.scss'
})
export class UserActivationComponent implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.activateUser();
  }

  async activateUser() {
    this.route.params.subscribe(params => {
      const url = environment.baseUrl + '/activate/' + params['token'];
      lastValueFrom(this.http.get(url));
      setTimeout(() => window.location.href = '/', 2000);
    });
  }

}
