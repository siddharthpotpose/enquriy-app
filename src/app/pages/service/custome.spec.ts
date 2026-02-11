import { TestBed } from '@angular/core/testing';

import { Custome } from './custome';

describe('Custome', () => {
  let service: Custome;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Custome);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
