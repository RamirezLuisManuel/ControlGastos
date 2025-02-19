import { TestBed } from '@angular/core/testing';

import { AuthspotiService } from './authspoti.service';

describe('AuthspotiService', () => {
  let service: AuthspotiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthspotiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
