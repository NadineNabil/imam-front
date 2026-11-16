import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraCaptureComponentComponent } from './camera-capture-component.component';

describe('CameraCaptureComponentComponent', () => {
  let component: CameraCaptureComponentComponent;
  let fixture: ComponentFixture<CameraCaptureComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CameraCaptureComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CameraCaptureComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
