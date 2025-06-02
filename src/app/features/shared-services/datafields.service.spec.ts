import { TestBed } from '@angular/core/testing';

import { DatafieldsService } from './datafields.service';

describe('DatafieldsService', () => {
  let service: DatafieldsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatafieldsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
