import { InsertionDirective } from './insertion.directive';
import { ViewContainerRef } from '@angular/core';

describe('InsertionDirective', () => {
  it('should create an instance', () => {
    const directive = new InsertionDirective(null);
    expect(directive).toBeTruthy();
  });
});
