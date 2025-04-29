import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetBuilderComponent } from './target-builder.component';

describe('TargetBuilderComponent', () => {
  let component: TargetBuilderComponent;
  let fixture: ComponentFixture<TargetBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TargetBuilderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TargetBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
