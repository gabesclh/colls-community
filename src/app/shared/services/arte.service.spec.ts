import { TestBed } from '@angular/core/testing';

import { ArteService } from './arte.service';

describe('ArteService', () => {
  let service: ArteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
