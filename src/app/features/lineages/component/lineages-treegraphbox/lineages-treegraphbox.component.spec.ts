import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineagesTreegraphboxComponent } from './lineages-treegraphbox.component';

describe('LineagesTreegraphboxComponent', () => {
  let component: LineagesTreegraphboxComponent;
  let fixture: ComponentFixture<LineagesTreegraphboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineagesTreegraphboxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LineagesTreegraphboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
