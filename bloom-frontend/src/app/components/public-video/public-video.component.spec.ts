import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicVideoComponent } from './public-video.component';

describe('PublicVideoComponent', () => {
  let component: PublicVideoComponent;
  let fixture: ComponentFixture<PublicVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicVideoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
