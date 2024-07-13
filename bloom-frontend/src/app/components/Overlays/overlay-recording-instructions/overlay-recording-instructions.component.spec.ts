import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayRecordingInstructionsComponent } from './overlay-recording-instructions.component';

describe('OverlayRecordingInstructionsComponent', () => {
  let component: OverlayRecordingInstructionsComponent;
  let fixture: ComponentFixture<OverlayRecordingInstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayRecordingInstructionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OverlayRecordingInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
