import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUsecaseComponent } from './edit-usecase.component';

describe('EditUsecaseComponent', () => {
  let component: EditUsecaseComponent;
  let fixture: ComponentFixture<EditUsecaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditUsecaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditUsecaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
