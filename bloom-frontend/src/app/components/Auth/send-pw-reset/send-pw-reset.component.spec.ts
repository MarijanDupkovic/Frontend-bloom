import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendPwResetComponent } from './send-pw-reset.component';

describe('SendPwResetComponent', () => {
  let component: SendPwResetComponent;
  let fixture: ComponentFixture<SendPwResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendPwResetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SendPwResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
