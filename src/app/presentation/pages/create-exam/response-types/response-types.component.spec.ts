import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseTypesComponent } from './response-types.component';

describe('ResponseTypesComponent', () => {
  let component: ResponseTypesComponent;
  let fixture: ComponentFixture<ResponseTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponseTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponseTypesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
