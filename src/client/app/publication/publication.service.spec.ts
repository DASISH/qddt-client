import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';

import { PublicationService } from './publication.service';
import { API_BASE_HREF } from '../api';

export function main() {
  describe('Publication service', () => {

    beforeEach(() => {

      TestBed.configureTestingModule({
        providers: [
          PublicationService,
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

    it('should update publication', async(() => {
      const mockBackend = TestBed.get(MockBackend);
      mockBackend.connections.subscribe((c: any) => {
        c.mockRespond(new Response(new ResponseOptions({
          body: '{'
          + '"id" : "2",'
          + '"name" : "publication"}'
        })));
      });
      const service = TestBed.get(PublicationService);
      const publication: any = { id: '2', name: 'test' };
      service.update(publication).subscribe((data: any) => {
        expect(data.name).toBe('publication');
      });
    }));

    it('should get all of publications', async(() => {
      const mockBackend = TestBed.get(MockBackend);
      mockBackend.connections.subscribe((c: any) => {
        c.mockRespond(new Response(new ResponseOptions({
          body: '[{'
          + '"id" : "7f000101-54aa-131e-8154-aa27fc230000",'
          + '"modified" : [ 2016, 9, 8, 15, 21, 26, 254000000 ],'
          + '"name" : "one publication",'
          + '"basedOnObject" : null,'
          + '"basedOnRevision" : null,'
          + '"version" : {"major" : 6, "minor" : 0, "versionLabel" : "", "revision" : null },'
          + '"changeKind" : "CONCEPTUAL",'
          + '"changeComment" : "Information added"'
          + '}]'
        })));
      });
      const service = TestBed.get(PublicationService);
      service.getAll('1').subscribe((data: any) => {
        expect(data.length).toBe(1);
        expect(data[0].name).toContain('publication');
      });
    }));
  });
}
