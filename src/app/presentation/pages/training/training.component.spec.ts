import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestMySelfComponent } from './training.component';

describe('TestMySelfComponent', () => {
  let component: TestMySelfComponent;
  let fixture: ComponentFixture<TestMySelfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestMySelfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestMySelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
