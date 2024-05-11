import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
const STEP_1 = 'step1';
const STEP_2 = 'step2';
const STEP_3 = 'step3';
const STEP_4 = 'step4';
@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, CommonModule,HttpClientModule,RouterLink,RouterLinkActive,NgIf],
  providers: [],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  password: string = '';
  password2: string = '';
  username: string = '';
  street: string = '';
  zipCode: string = '';
  city: string = '';
  country: string = '';
  hide: boolean = true;
  hide2: boolean = true;
  send: boolean = false;
  fail_message: string = '';
  message = ``;
  success: boolean = false;
  signup_failed: boolean = false;
  step1: boolean = true;
  step2: boolean = false;
  step3: boolean = false;
  step4: boolean = false;

  setStep(step: string) {
    this.step1 = step === STEP_1;
    this.step2 = step === STEP_2;
    this.step3 = step === STEP_3;
    this.step4 = step === STEP_4;
  }
  isDisabled() {
    if(this.step1){
      if(!this.username && !this.email){
        return true;

      }else{
        return false;
      }
    }
    if(this.step2){
      if(!this.firstName && !this.lastName){
        return true;
      }else{
        return false;
      }
    }
    if(this.step3){
      if(!this.password && !this.password2){
        return true;
      }else{
        return false;
      }
    }
    if(this.step4){
      if(!this.street && !this.zipCode && !this.city && !this.country){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  };
  constructor(private authService: AuthService, private router: Router) { this.addEnterListener() }

  async signup() {
    this.send = true;

      await this.authService.signUp(this.email, this.password, this.password2, this.username, this.firstName, this.lastName, this.street, this.zipCode, this.city, this.country)
      .then(()=>{
        this.success = true;
        setTimeout(() => this.router.navigateByUrl('/signin'), 5000);

      }).catch((e) => {
        let error: any = e;
        if (error.status == 400 || error.status == 405 ) {
          this.setErrorMessage('Email oder username bereits in Verwendung', error);
        }
       });
  }
  resetErrorMessage() {
    setTimeout(() => {
      this.signup_failed = false;
      this.fail_message = '';
      this.message = '';
      this.send = false;
    }, 3000);
  }

  setErrorMessage(message: string, error: any) {
    this.signup_failed = true;
    this.fail_message = error.error;
    this.message = message;
    this.resetErrorMessage();
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
        if (this.password !== '' && this.password2 !== '' && this.email !== '') {
          this.signup();
        } else this.setErrorMessage('Bitte fülle alle Felder aus!', { error: 'Bitte fülle alle Felder aus!' });
      }

    }
    );
  }

  next(step: string) {
    if (step === STEP_1) {
      this.setStep(STEP_1);
    } else if (step === STEP_2 && this.username && this.email) {
      this.setStep(STEP_2);
    } else if (step === STEP_3 && this.firstName && this.lastName) {
      this.setStep(STEP_3);
    } else if (step === STEP_4 && this.password && this.password2) {
      this.setStep(STEP_4);
    }
  }

  back(){
    if(this.step2){
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
    }
    else if(this.step3){
      this.step1 = false;
      this.step2 = true;
      this.step3 = false;
      this.step4 = false;
    }
    else if(this.step4){
      this.step1 = false;
      this.step2 = false;
      this.step3 = true;
      this.step4 = false;
    }
  }

  forward(){
    if(this.step1){
      this.step1 = false;
      this.step2 = true;
      this.step3 = false;
      this.step4 = false;
    }
    else if(this.step2){
      this.step1 = false;
      this.step2 = false;
      this.step3 = true;
      this.step4 = false;
    }
    else if(this.step3){
      this.step1 = false;
      this.step2 = false;
      this.step3 = false;
      this.step4 = true;
    }
  }
}
