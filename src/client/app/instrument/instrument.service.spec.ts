import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';

import { InstrumentService } from './instrument.service';
import { BaseService } from '../shared/base.service';
import { API_BASE_HREF } from '../api';

export function main() {
  describe('Instrument Service', () => {

    beforeEach(() => {

      TestBed.configureTestingModule({
        providers: [
          InstrumentService,
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

    it('should update instrument', async(() => {
      let mockBackend = TestBed.get(MockBackend);
      mockBackend.connections.subscribe((c: any) => {
        c.mockRespond(new Response(new ResponseOptions({
          body: '{'
          + '"id" : "2",'
          + '"name" : "instrument"}'
        })));
      });
      let service = TestBed.get(InstrumentService);
      let instrument: any = { id: '2', name: 'test' };
      service.update(instrument).subscribe((data: any) => {
        expect(data.name).toBe('instrument');
      });
    }));

    it('should create instrument', async(() => {
      let mockBackend = TestBed.get(MockBackend);
      mockBackend.connections.subscribe((c: any) => {
        c.mockRespond(new Response(new ResponseOptions({
          body: '[{'
          + '"id" : "7f000101-54aa-131e-8154-aa27fc230000",'
          + '"modified" : [ 2016, 9, 8, 15, 21, 26, 254000000 ],'
          + '"name" : "one instrument",'
          + '"basedOnObject" : null,'
          + '"basedOnRevision" : null,'
          + '"version" : {"major" : 6, "minor" : 0, "versionLabel" : "", "revision" : null },'
          + '"changeKind" : "CONCEPTUAL",'
          + '"changeComment" : "Information added"'
          + '}]'
        })));
      });
      let service = TestBed.get(InstrumentService);
      service.create({name: 'test'}).subscribe((data: any) => {
        expect(data.length).toBe(1);
        expect(data[0].name).toContain('instrument');
      });
    }));
  });
}
