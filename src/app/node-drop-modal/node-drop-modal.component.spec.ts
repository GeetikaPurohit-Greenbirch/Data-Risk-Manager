import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeDropModalComponent } from './node-drop-modal.component';

describe('NodeDropModalComponent', () => {
  let component: NodeDropModalComponent;
  let fixture: ComponentFixture<NodeDropModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodeDropModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NodeDropModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
