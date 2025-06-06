import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUseCaseComponent } from './create-use-case.component';

describe('CreateUseCaseComponent', () => {
  let component: CreateUseCaseComponent;
  let fixture: ComponentFixture<CreateUseCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUseCaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateUseCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
