import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineagesTreeComponent } from './lineages-tree.component';

describe('LineagesTreeComponent', () => {
  let component: LineagesTreeComponent;
  let fixture: ComponentFixture<LineagesTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineagesTreeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LineagesTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
