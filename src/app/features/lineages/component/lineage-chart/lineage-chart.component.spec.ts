import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineageChartComponent } from './lineage-chart.component';

describe('LineageChartComponent', () => {
  let component: LineageChartComponent;
  let fixture: ComponentFixture<LineageChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineageChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LineageChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
