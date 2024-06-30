import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { StepService, STEP_1, STEP_2, STEP_3, STEP_4 } from '../../../services/Stepper/step.service';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, RouterLink, RouterLinkActive, NgIf],
  providers: [],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  hide: boolean = true;
  hide2: boolean = true;
  send: boolean = false;
  fail_message: string = '';
  message = ``;
  success: boolean = false;
  signup_failed: boolean = false;

  steps = this.stepper.getSteps();
  signupForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    password2: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
  });

  constructor(private cdRef: ChangeDetectorRef, private authService: AuthService, private router: Router, private stepper: StepService) { this.addEnterListener() }

  isDisabled() {
    this.steps = this.stepper.getSteps();
    if (this.steps.step1) {
      return !(this.signupForm.controls.username?.valid && this.signupForm.controls.email?.valid);
    }
    if (this.steps.step2) {
      return !(this.signupForm.controls.password?.valid && this.signupForm.controls.password2?.valid);
    }
    // if (this.steps.step3) {
    //   return !(this.signupForm.controls.password?.valid && this.signupForm.controls.password2?.valid);
    // }
    // if (this.steps.step4) {
    //   return !(this.signupForm.controls.street?.valid && this.signupForm.controls.zipCode?.valid && this.signupForm.controls.city?.valid && this.signupForm.controls.country?.valid);
    // }
    return false;
  }

  async signup() {
    this.send = true;
    try {
      await this.authService.signUp(this.signupForm);
      this.success = true;
      setTimeout(() => this.router.navigateByUrl('/signin'), 5000);
    } catch (e) {
      let error: any = e;
      if (error.status == 400 || error.status == 405) {
        this.setErrorMessage('Email oder username bereits in Verwendung', error);
      }
    }
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
        if (this.signupForm.controls.password && this.signupForm.controls.password2 && this.signupForm.controls.email) {
          this.signup();
        } else this.setErrorMessage('Bitte fülle alle Felder aus!', { error: 'Bitte fülle alle Felder aus!' });
      }
    }
    );
  }

  next(step: string) {
    setTimeout(() => {
      if (step === STEP_1) {
        this.stepper.setStep(STEP_1);
      } else if (step === STEP_2 && this.signupForm.controls.password.valid && this.signupForm.controls.password2.valid) {
        this.stepper.setStep(STEP_2);
      }
      this.cdRef.detectChanges();

    });
  }

  back() {
    setTimeout(() => {

      this.steps = this.stepper.getSteps();
      if (this.steps.step2) {
        this.stepper.setStep(STEP_1);
      }
      else if (this.steps.step3) {
        this.stepper.setStep(STEP_2);
      }
      else if (this.steps.step4) {
        this.stepper.setStep(STEP_3);
      }
      this.cdRef.detectChanges();

    });

  }

  forward() {
    setTimeout(() => {
      this.steps = this.stepper.getSteps();
      if (this.steps.step1) {
        this.stepper.setStep(STEP_2);
      }
      else if (this.steps.step2) {
        this.stepper.setStep(STEP_3);
      }
      else if (this.steps.step3) {
        this.stepper.setStep(STEP_4);
      }
      this.cdRef.detectChanges();
    });
  }
}
