import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLessonsComponent } from './view-learningUnits.component';

describe('ViewLessonsComponent', () => {
  let component: ViewLessonsComponent;
  let fixture: ComponentFixture<ViewLessonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewLessonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewLessonsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
