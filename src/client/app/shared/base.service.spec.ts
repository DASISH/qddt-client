import { BaseRequestOptions, ConnectionBackend, Http, Response, ResponseOptions } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';

import { API_BASE_HREF } from '../api';
import { BaseService } from './base.service';

export function main() {
  describe('Base HTTP Service', () => {

    beforeEach(() => {

      TestBed.configureTestingModule({
        providers: [
          BaseService,
          MockBackend,
          BaseRequestOptions,
          {
            provide: Http,
            useFactory: (backend: ConnectionBackend, options: BaseRequestOptions) => new Http(backend, options),
            deps: [MockBackend, BaseRequestOptions]
          }, {
            provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ]
      });
    });

    it('should resolve to list of objects when get called', async(() => {
      let service = TestBed.get(BaseService);
      let mockBackend = TestBed.get(MockBackend);

      mockBackend.connections.subscribe((c: any) => {
        c.mockRespond(new Response(new ResponseOptions({ body: '["q1", "q2"]' })));
      });

      service.get('test').subscribe((data: any) => {
        expect(data).toEqual(['q1', 'q2']);
      });
    }));

    it('should post object', async(() => {
      let service = TestBed.get(BaseService);
      let mockBackend = TestBed.get(MockBackend);

      mockBackend.connections.subscribe((c: any) => {
        c.mockRespond(new Response(new ResponseOptions({ body: '{"result": "q2"}' })));
      });

      service.post({ 'test': 'test' }, 'test').subscribe((data: any) => {
        expect(data).toEqual({ 'result': 'q2' });
      });
    }));
  });
}
