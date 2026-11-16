import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoderComponent } from './recoder.component';

describe('RecoderComponent', () => {
  let component: RecoderComponent;
  let fixture: ComponentFixture<RecoderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecoderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
