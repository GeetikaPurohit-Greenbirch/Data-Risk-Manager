import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLineageNewComponent } from './create-lineage-new.component';

describe('CreateLineageNewComponent', () => {
  let component: CreateLineageNewComponent;
  let fixture: ComponentFixture<CreateLineageNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateLineageNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateLineageNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
