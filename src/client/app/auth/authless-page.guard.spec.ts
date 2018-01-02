import { TestBed, async, inject } from '@angular/core/testing';

import { AuthlessPageGuard } from './authless-page.guard';

describe('AuthlessPageGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthlessPageGuard]
    });
  });

  it('should ...', inject([AuthlessPageGuard], (guard: AuthlessPageGuard) => {
    expect(guard).toBeTruthy();
  }));
});
