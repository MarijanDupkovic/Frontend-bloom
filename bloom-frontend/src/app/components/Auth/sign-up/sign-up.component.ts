import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { StepService, STEP_1, STEP_2, STEP_3, STEP_4 } from '../../../services/Stepper/step.service';
import { ChangeDetectorRef } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { UserFeedBackComponent } from '../../Overlays/user-feed-back/user-feed-back.component';
import { UserfeedbackService } from '../../../services/userFeedback/userfeedback.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, RouterLink, RouterLinkActive, NgIf, UserFeedBackComponent],
  providers: [],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  hide: boolean = true;
  hide2: boolean = true;
  send: boolean = false;
  errorSubscription: Subscription = new Subscription;
  errorMessage: string = '';

  message = ``;
  success: boolean = false;
  steps = this.stepper.getSteps();
  signupForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    password2: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    privacy: new FormControl('', Validators.requiredTrue)
  });

  constructor(private errorService: UserfeedbackService, private metaTagService: Meta, private cdRef: ChangeDetectorRef, private authService: AuthService, private router: Router, private stepper: StepService) { this.addEnterListener() }

  ngOnInit() {
    this.metaTagService.updateTag(
      { name: 'description', content: 'Registriere dich für captureVue dem kostenlosen Bildschirmrekorder für PC und Mac. Mit captureVue kannst du deinen Bildschirm aufnehmen, Videos erstellen und mit anderen teilen.' }
    );
    this.errorSubscription = this.errorService.errorMessage$.subscribe((error: any) => {
      this.errorMessage = error;
      this.message = error;
    });
  }

  isDisabled() {
    this.steps = this.stepper.getSteps();
    if (this.steps.step1) {
      return !(this.signupForm.controls.username?.valid && this.signupForm.controls.email?.valid);
    }
    if (this.steps.step2) {
      return !(this.signupForm.controls.password?.valid && this.signupForm.controls.password2?.valid && this.signupForm.controls.password.value === this.signupForm.controls.password2.value && this.signupForm.controls.privacy.valid);
    }
    return false;
  }

  async signup() {
    this.send = true;
    try {
      await this.authService.signUp(this.signupForm);
      this.success = true;
      setTimeout(() => {
        this.router.navigateByUrl('/signin');
        this.success = false;
      }
        , 3000);

    } catch (error: any) {
      if (error.status == 400 || error.status == 405) this.errorService.handleError(error);
    }
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
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', async (e: KeyboardEvent) => {

        if (e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
          if (this.signupForm.valid) this.signup();
        }
      });
    }
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
