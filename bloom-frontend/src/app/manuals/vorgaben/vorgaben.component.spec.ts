import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VorgabenComponent } from './vorgaben.component';

describe('VorgabenComponent', () => {
  let component: VorgabenComponent;
  let fixture: ComponentFixture<VorgabenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VorgabenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VorgabenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
