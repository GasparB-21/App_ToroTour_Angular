import { TestBed } from '@angular/core/testing';

import { MonumentoService } from './monumento-service';

describe('MonumentoService', () => {
  let service: MonumentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonumentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
