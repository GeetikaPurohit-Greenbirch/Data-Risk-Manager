import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTargetComponent } from './edit-target.component';

describe('EditTargetComponent', () => {
  let component: EditTargetComponent;
  let fixture: ComponentFixture<EditTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTargetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
