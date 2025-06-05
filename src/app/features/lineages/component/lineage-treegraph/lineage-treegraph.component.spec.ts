import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineageTreegraphComponent } from './lineage-treegraph.component';

describe('LineageTreegraphComponent', () => {
  let component: LineageTreegraphComponent;
  let fixture: ComponentFixture<LineageTreegraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineageTreegraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LineageTreegraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
