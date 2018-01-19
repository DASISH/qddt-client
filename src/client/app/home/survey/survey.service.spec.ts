import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';

import { SurveyService } from './survey.service';
import { API_BASE_HREF } from '../../api';

export function main() {
  describe('Survey Service', () => {

    beforeEach(() => {

      TestBed.configureTestingModule({
        providers: [
          SurveyService,
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

    it('should update survey', async(() => {
      const mockBackend = TestBed.get(MockBackend);
      mockBackend.connections.subscribe((c: any) => {
        c.mockRespond(new Response(new ResponseOptions({
          body: '{'
          + '"id" : "2",'
          + '"name" : "survey"}'
        })));
      });
      const service = TestBed.get(SurveyService);
      const survey: any = { id: '2', name: 'test' };
      service.save(survey).subscribe((data: any) => {
        expect(data.name).toBe('survey');
      });
    }));

    it('should get all of surveys', async(() => {
      const mockBackend = TestBed.get(MockBackend);
      mockBackend.connections.subscribe((c: any) => {
        c.mockRespond(new Response(new ResponseOptions({
          body: '[{'
          + '"id" : "7f000101-54aa-131e-8154-aa27fc230000",'
          + '"modified" : [ 2016, 9, 8, 15, 21, 26, 254000000 ],'
          + '"name" : "The European Social Survey (ESS)",'
          + '"basedOnObject" : null,'
          + '"basedOnRevision" : null,'
          + '"version" : {"major" : 6, "minor" : 0, "versionLabel" : "", "revision" : null },'
          + '"changeKind" : "CONCEPTUAL",'
          + '"changeComment" : "Information added"'
          + '}]'
        })));
      });
      const service = TestBed.get(SurveyService);
      service.getAll('1').subscribe((data: any) => {
        expect(data.length).toBe(1);
        expect(data[0].name).toContain('ESS');
      });
    }));
  });
}
