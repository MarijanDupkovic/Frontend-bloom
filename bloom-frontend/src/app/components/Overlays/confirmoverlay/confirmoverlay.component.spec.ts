import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmoverlayComponent } from './confirmoverlay.component';

describe('ConfirmoverlayComponent', () => {
  let component: ConfirmoverlayComponent;
  let fixture: ComponentFixture<ConfirmoverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmoverlayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmoverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
