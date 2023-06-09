import { TestBed } from '@angular/core/testing';

import { InstalledappService } from './installedapp.service';

describe('InstalledappService', () => {
  let service: InstalledappService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstalledappService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
