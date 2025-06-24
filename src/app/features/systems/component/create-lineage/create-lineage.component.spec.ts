import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLineageComponent } from './create-lineage.component';

describe('CreateLineageComponent', () => {
  let component: CreateLineageComponent;
  let fixture: ComponentFixture<CreateLineageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateLineageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateLineageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
