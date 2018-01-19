import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';

import { CommentService } from './comment.service';
import { API_BASE_HREF } from '../../api';

export function main() {
  describe('Comment Service', () => {

    beforeEach(() => {

      TestBed.configureTestingModule({
        providers: [
          CommentService,
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

    it('should create comment', async(() => {
      let mockBackend = TestBed.get(MockBackend);
      mockBackend.connections.subscribe((c: any) => {
        c.mockRespond(new Response(new ResponseOptions({
          body: '{'
          + '"id" : "2",'
          + '"ownerId" : "1",'
          + '"comment" : "test"}'
        })));
      });
      let service = TestBed.get(CommentService);
      let comment: any = { 'ownerId': '1', 'comment': 'test' };
      service.createComment(comment).subscribe((data: any) => {
        expect(data.id).toBe('2');
      });
    }));

    it('should update comment', async(() => {
      let mockBackend = TestBed.get(MockBackend);
      mockBackend.connections.subscribe((c: any) => {
        c.mockRespond(new Response(new ResponseOptions({
          body: '{'
          + '"id" : "2",'
          + '"ownerId" : "1",'
          + '"comment" : "testa"}'
        })));
      });
      let service = TestBed.get(CommentService);
      let comment: any = { id: '2', ownerId: '1', comment: 'test' };
      service.updateComment(comment).subscribe((data: any) => {
        expect(data.comment).toBe('testa');
      });
    }));

    it('should get all of comments', async(() => {
      let mockBackend = TestBed.get(MockBackend);
      mockBackend.connections.subscribe((c: any) => {
        c.mockRespond(new Response(new ResponseOptions({
          body: '[{'
          + '"id" : "2",'
          + '"ownerId" : "1",'
          + '"comment" : "testa"}]'
        })));
      });
      let service = TestBed.get(CommentService);
      service.getAll('1').subscribe((data: any) => {
        expect(data.length).toBe(1);
      });
    }));
  });
}
