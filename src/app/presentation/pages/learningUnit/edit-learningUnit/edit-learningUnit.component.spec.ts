import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditlearningUnitComponent } from './edit-learningUnit.component';

describe('EditlearningUnitComponent', () => {
  let component: EditlearningUnitComponent;
  let fixture: ComponentFixture<EditlearningUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditlearningUnitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditlearningUnitComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
