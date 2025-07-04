import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareAccessComponent } from './share-access.component';

describe('ShareAccessComponent', () => {
  let component: ShareAccessComponent;
  let fixture: ComponentFixture<ShareAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareAccessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShareAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
