import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlexDigramComponent } from './alex-digram.component';

describe('AlexDigramComponent', () => {
  let component: AlexDigramComponent;
  let fixture: ComponentFixture<AlexDigramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlexDigramComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlexDigramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
