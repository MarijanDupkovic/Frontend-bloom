import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectLinksComponent } from './redirect-links.component';

describe('RedirectLinksComponent', () => {
  let component: RedirectLinksComponent;
  let fixture: ComponentFixture<RedirectLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedirectLinksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RedirectLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
