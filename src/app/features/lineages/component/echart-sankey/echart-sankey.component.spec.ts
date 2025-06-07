import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EchartSankeyComponent } from './echart-sankey.component';

describe('EchartSankeyComponent', () => {
  let component: EchartSankeyComponent;
  let fixture: ComponentFixture<EchartSankeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EchartSankeyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EchartSankeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
