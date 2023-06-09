import { TestBed } from '@angular/core/testing';

import { ActkeyService } from './actkey.service';

describe('ActkeyService', () => {
  let service: ActkeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActkeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
