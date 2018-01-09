import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';

import { QuestionService } from './question.service';
import { BaseService } from '../shared/base.service';
import { API_BASE_HREF } from '../api';

export function main() {
  describe('Question service', () => {

    beforeEach(() => {

      TestBed.configureTestingModule({
        providers: [
          QuestionService,
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

    it('should update question', async(() => {
      const mockBackend = TestBed.get(MockBackend);
      mockBackend.connections.subscribe((c: any) => {
        c.mockRespond(new Response(new ResponseOptions({
          body: '{'
          + '"id" : "2",'
          + '"name" : "question"}'
        })));
      });
      const service = TestBed.get(QuestionService);
      const question: any = { id: '2', name: 'test' };
      service.updateQuestionItem(question).subscribe((data: any) => {
        expect(data.name).toBe('question');
      });
    }));

    it('should get all of questions', async(() => {
      const mockBackend = TestBed.get(MockBackend);
      mockBackend.connections.subscribe((c: any) => {
        c.mockRespond(new Response(new ResponseOptions({
          body: '[{'
          + '"id" : "7f000101-54aa-131e-8154-aa27fc230000",'
          + '"modified" : [ 2016, 9, 8, 15, 21, 26, 254000000 ],'
          + '"name" : "one question",'
          + '"basedOnObject" : null,'
          + '"basedOnRevision" : null,'
          + '"version" : {"major" : 6, "minor" : 0, "versionLabel" : "", "revision" : null },'
          + '"changeKind" : "CONCEPTUAL",'
          + '"changeComment" : "Information added"'
          + '}]'
        })));
      });
      const service = TestBed.get(QuestionService);
      service.getQuestionItemPage('1').subscribe((data: any) => {
        expect(data.length).toBe(1);
        expect(data[0].name).toContain('question');
      });
    }));
  });
}
