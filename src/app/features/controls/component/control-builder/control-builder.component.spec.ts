import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlBuilderComponent } from './control-builder.component';

describe('ControlBuilderComponent', () => {
  let component: ControlBuilderComponent;
  let fixture: ComponentFixture<ControlBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlBuilderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ControlBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
