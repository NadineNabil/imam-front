import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoldersTreeComponent } from './folders-tree.component';

describe('FoldersTreeComponent', () => {
  let component: FoldersTreeComponent;
  let fixture: ComponentFixture<FoldersTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoldersTreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoldersTreeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
