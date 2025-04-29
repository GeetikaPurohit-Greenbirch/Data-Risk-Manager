import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceBuilderComponent } from './source-builder.component';

describe('SourceBuilderComponent', () => {
  let component: SourceBuilderComponent;
  let fixture: ComponentFixture<SourceBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceBuilderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SourceBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
