import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ErrorResponse {
  status: number;
  error: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserfeedbackService {
  private _errorCode = new BehaviorSubject<number>(0);
  private _errorMessage = new BehaviorSubject<string>('');
  private _successMessage = new BehaviorSubject<string>('');
  private _failed = new BehaviorSubject<boolean>(false);

  errorCode$ = this._errorCode.asObservable();
  errorMessage$ = this._errorMessage.asObservable();
  successMessage$ = this._successMessage.asObservable();
  failed$ = this._failed.asObservable();


  constructor() { }


  setErrorCode(errorCode: number) {
    this._errorCode.next(errorCode);
  }

  setErrorMessage(errorMessage: string) {
    this._errorMessage.next(errorMessage);
  }

  setSuccessMessage(successMessage: string) {
    this._successMessage.next(successMessage);
  }

  handleErrorMessages(error: ErrorResponse): void {
    this.setErrorMessages(error);
    this.resetErrorMessages();
  }

  handleSuccessMessages(successMessage: string): void {
    this.setSuccessMessages(successMessage);
    this.resetSuccessMessages();
  }

  setErrorMessages(error: ErrorResponse): void {
    setTimeout(() => {
      this.setErrorCode(error.status);
      this.setErrorMessage(error.error);
    }, 1000);
  }

  setSuccessMessages(successMessage: string): void {
    setTimeout(() => {
      this.setSuccessMessage(successMessage);
    }, 1000);
  }

  async resetErrorMessages() {
    await new Promise(resolve => setTimeout(resolve, 3000));
    this._failed.next(false);

    this.setErrorCode(0);
    this.setErrorMessage('');
  }

  async resetSuccessMessages() {
    await new Promise(resolve => setTimeout(resolve, 3000));
    this.setSuccessMessage('');
  }

  async handleError(error: any) {
    this._failed.next(true);
    const isKnownError = [400, 401, 403, 404, 500].includes(error.status);

    if (!isKnownError) return;

    this.setErrorCode(error.status);
    const errorMessage = error.statusText === 'Not Found'
      ? 'Username oder Passwort falsch!'
      : error.error;
    this.setErrorMessage(errorMessage);
    this.resetErrorMessages();
  }
}
