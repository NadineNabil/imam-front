import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeSetttingsComponent } from './practice-setttings.component';

describe('PracticeSetttingsComponent', () => {
  let component: PracticeSetttingsComponent;
  let fixture: ComponentFixture<PracticeSetttingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeSetttingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticeSetttingsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
