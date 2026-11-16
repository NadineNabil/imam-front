import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingCameraWidgetComponent } from './floating-camera-widget.component';

describe('FloatingCameraWidgetComponent', () => {
  let component: FloatingCameraWidgetComponent;
  let fixture: ComponentFixture<FloatingCameraWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingCameraWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FloatingCameraWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
