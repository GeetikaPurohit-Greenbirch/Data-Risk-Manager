import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineageTreeComponent } from './lineage-tree.component';

describe('LineageTreeComponent', () => {
  let component: LineageTreeComponent;
  let fixture: ComponentFixture<LineageTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineageTreeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LineageTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
