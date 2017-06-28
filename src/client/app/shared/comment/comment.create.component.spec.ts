import { Component } from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';
import { CommentCreateComponent } from './comment.create.component';
import { CommentService } from './comment.service';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { API_BASE_HREF } from '../../api';
import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

class CommentServiceSpy {
  createComment = jasmine.createSpy('createComment').and.callFake(function (key) {
    return { };
  });
}

export function main() {
  describe('Comment create component', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, CommentCreateComponent],
        providers: [
          MockBackend,
          BaseRequestOptions,
          { provide: CommentService, useClass: CommentServiceSpy },
          {
            provide: Http,
            useFactory: (backend: ConnectionBackend, options: BaseRequestOptions) => new Http(backend, options),
            deps: [MockBackend, BaseRequestOptions]
          },
          { provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ],
        imports: [ CommonModule, FormsModule ]
      });
    });

    it('should create comment',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(TestComponent);
            let de = fixture.debugElement.query(By.css('textarea'));
            expect(de.nativeElement).not.toBeNull();
            let compiled: any = de.nativeElement;
            compiled.value = 'test';
            fixture.detectChanges();
            let mockBackend = TestBed.get(MockBackend);
            mockBackend.connections.subscribe((c: any) => {
              c.mockRespond(new Response(new ResponseOptions({
                body: '{"id" : "2", "ownerId" : "1", "comment" : "test"}'
              })));
            });
            let button = fixture.debugElement.query(By.css('button'));
            button.nativeElement.click();
            fixture.detectChanges();
            expect(fixture.componentInstance.comment).not.toBeUndefined();
            expect(fixture.componentInstance.comment.comment).toBe('test');
          });
      }));
  });
}

@Component({
  selector: 'test-component',
  template: `<qddt-comment-create [ownerId]="1"
    (addedCommentEvent)="onAddedCommentEvent($event)">
    </qddt-comment-create>`
})
class TestComponent {
  comment: any;

  onAddedCommentEvent(comment: any) {
    this.comment = comment;
  }

}
