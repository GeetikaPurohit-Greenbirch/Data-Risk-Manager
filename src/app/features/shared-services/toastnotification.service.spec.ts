import { TestBed } from '@angular/core/testing';

import { ToastnotificationService } from './toastnotification.service';

describe('ToastnotificationService', () => {
  let service: ToastnotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastnotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
