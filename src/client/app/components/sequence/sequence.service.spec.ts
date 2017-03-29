import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';

import { SequenceService } from './sequence.service';
import { BaseService } from '../../common/base.service';
import { API_BASE_HREF } from '../../api';

export function main() {
  describe('Sequence service', () => {

    beforeEach(() => {

      TestBed.configureTestingModule({
        providers: [
          SequenceService,
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

    it('should update sequence', async(() => {
      let mockBackend = TestBed.get(MockBackend);
      mockBackend.connections.subscribe((c: any) => {
        c.mockRespond(new Response(new ResponseOptions({
          body: '{'
          + '"id" : "2",'
          + '"name" : "sequence"}'
        })));
      });
      let service = TestBed.get(SequenceService);
      let sequence: any = { id: '2', name: 'test' };
      service.update(sequence).subscribe((data: any) => {
        expect(data.name).toBe('sequence');
      });
    }));

    it('should get all of sequences', async(() => {
      let mockBackend = TestBed.get(MockBackend);
      mockBackend.connections.subscribe((c: any) => {
        c.mockRespond(new Response(new ResponseOptions({
          body: '[{'
          + '"id" : "7f000101-54aa-131e-8154-aa27fc230000",'
          + '"modified" : [ 2016, 9, 8, 15, 21, 26, 254000000 ],'
          + '"name" : "one sequence",'
          + '"basedOnObject" : null,'
          + '"basedOnRevision" : null,'
          + '"version" : {"major" : 6, "minor" : 0, "versionLabel" : "", "revision" : null },'
          + '"changeKind" : "CONCEPTUAL",'
          + '"changeComment" : "Information added"'
          + '}]'
        })));
      });
      let service = TestBed.get(SequenceService);
      service.getElements('SEQUENCE_CONSTRUCT', '1')
        .subscribe((data: any) => {
        expect(data.length).toBe(1);
        expect(data[0].name).toContain('sequence');
      });
    }));
  });
}