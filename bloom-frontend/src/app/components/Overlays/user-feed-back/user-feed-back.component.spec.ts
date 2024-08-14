import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFeedBackComponent } from './user-feed-back.component';

describe('UserFeedBackComponent', () => {
  let component: UserFeedBackComponent;
  let fixture: ComponentFixture<UserFeedBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFeedBackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserFeedBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
