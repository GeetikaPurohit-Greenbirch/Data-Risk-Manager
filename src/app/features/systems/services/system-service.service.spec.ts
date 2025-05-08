import { TestBed } from '@angular/core/testing';

import { SystemServiceService } from './system-service.service';

describe('SystemServiceService', () => {
  let service: SystemServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
