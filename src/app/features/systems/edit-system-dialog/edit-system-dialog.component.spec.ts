import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSystemDialogComponent } from './edit-system-dialog.component';

describe('EditSystemDialogComponent', () => {
  let component: EditSystemDialogComponent;
  let fixture: ComponentFixture<EditSystemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSystemDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditSystemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
