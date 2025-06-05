import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineageSankeyComponent } from './lineage-sankey.component';

describe('LineageSankeyComponent', () => {
  let component: LineageSankeyComponent;
  let fixture: ComponentFixture<LineageSankeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineageSankeyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LineageSankeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
