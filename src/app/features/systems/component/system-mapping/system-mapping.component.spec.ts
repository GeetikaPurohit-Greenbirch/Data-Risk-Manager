import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemMappingComponent } from './system-mapping.component';

describe('SystemMappingComponent', () => {
  let component: SystemMappingComponent;
  let fixture: ComponentFixture<SystemMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemMappingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SystemMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
