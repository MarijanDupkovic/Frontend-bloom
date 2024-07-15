import { TestBed } from '@angular/core/testing';

import { UserfeedbackService } from './userfeedback.service';

describe('UserfeedbackService', () => {
  let service: UserfeedbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserfeedbackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
