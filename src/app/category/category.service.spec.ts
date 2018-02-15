import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';

import { CategoryService } from './category.service';
import { API_BASE_HREF } from '../api';

export function main() {
  describe('Category Service', () => {

    beforeEach(() => {

      TestBed.configureTestingModule({
        providers: [
          CategoryService,
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

    it('should update category', async(() => {
      const mockBackend = TestBed.get(MockBackend);
      mockBackend.connections.subscribe((c: any) => {
        c.mockRespond(new Response(new ResponseOptions({
          body: '{'
          + '"id" : "2",'
          + '"name" : "category"}'
        })));
      });
      const service = TestBed.get(CategoryService);
      const survey: any = { id: '2', name: 'test' };
      service.save(survey).subscribe((data: any) => {
        expect(data.name).toBe('category');
      });
    }));

    it('should get all of categories', async(() => {
      const mockBackend = TestBed.get(MockBackend);
      mockBackend.connections.subscribe((c: any) => {
        c.mockRespond(new Response(new ResponseOptions({
          body: '[{'
          + '"id" : "7f000101-54aa-131e-8154-aa27fc230000",'
          + '"modified" : [ 2016, 9, 8, 15, 21, 26, 254000000 ],'
          + '"name" : "one category",'
          + '"basedOnObject" : null,'
          + '"basedOnRevision" : null,'
          + '"version" : {"major" : 6, "minor" : 0, "versionLabel" : "", "revision" : null },'
          + '"changeKind" : "CONCEPTUAL",'
          + '"changeComment" : "Information added"'
          + '}]'
        })));
      });
      const service = TestBed.get(CategoryService);
      service.getAll('1').subscribe((data: any) => {
        expect(data.length).toBe(1);
        expect(data[0].name).toContain('category');
      });
    }));
  });
}
