import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineagesComponent } from './lineages.component';

describe('LineagesComponent', () => {
  let component: LineagesComponent;
  let fixture: ComponentFixture<LineagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LineagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
