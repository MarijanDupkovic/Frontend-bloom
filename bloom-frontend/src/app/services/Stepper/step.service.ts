import { Injectable } from '@angular/core';

export const STEP_1 = 'step1';
export const STEP_2 = 'step2';
export const STEP_3 = 'step3';
export const STEP_4 = 'step4';

@Injectable({
  providedIn: 'root'
})
export class StepService {
  private step1: boolean = true;
  private step2: boolean = false;
  private step3: boolean = false;
  private step4: boolean = false;
  constructor() { }

  setStep(step: string) {
    this.step1 = step === STEP_1;
    this.step2 = step === STEP_2;
    this.step3 = step === STEP_3;
    this.step4 = step === STEP_4;
  }

  getSteps() {
    return {
      step1: this.step1,
      step2: this.step2,
      step3: this.step3,
      step4: this.step4
    };
  }

  get getStep1() {
    return this.step1;
  }
  get getStep2() {
    return this.step2;
  }
  get getStep3() {
    return this.step3;
  }
  get getStep4() {
    return this.step4;
  }
}
