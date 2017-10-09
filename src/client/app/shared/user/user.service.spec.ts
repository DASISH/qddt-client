import { BaseRequestOptions } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';

import { UserService } from './user.service';

export function main() {
  describe('User Service', () => {

    beforeEach(() => {
      var store = {};

      spyOn(localStorage, 'getItem').and.callFake(function (key) {
        return store[key];
      });
      spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
        return store[key] = value + '';
      });
      spyOn(localStorage, 'clear').and.callFake(function () {
        store = {};
      });

      TestBed.configureTestingModule({
        providers: [
          UserService,
          MockBackend,
          BaseRequestOptions
        ]
      });
    });

    it('should empty', async(() => {
      let service = TestBed.get(UserService);
      let item = service.get('test');
      expect(item).toBeNull();
    }));

    it('should get user', async(() => {
      let service = TestBed.get(UserService);
      service.set('qddt');
      let item = service.get('qddt');
      expect(item).toEqual('qddt');
    }));
  });
}
