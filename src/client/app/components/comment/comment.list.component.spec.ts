import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';
import { CommentListComponent } from './comment.list.component';
import { CommentService } from './comment.service';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { API_BASE_HREF } from '../../api';
import { BaseRequestOptions, Http, ConnectionBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

export function main() {
  describe('Comment list component', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [LocalDatePipe, TestComponent, CommentListComponent, CommentCreateComponent],
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

    it('should work with empty comment',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(TestComponent);
            let de = fixture.debugElement.queryAll(By.css('qddt-comment-create'));
            expect(de.length).toBe(0);
          });
      }));

    it('should work with comments',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(TestComponent);
            fixture.componentInstance.comments = [{id:2, ownerId:'1', comment: 'test'}];
            fixture.detectChanges();
            let buttons = fixture.debugElement.queryAll(By.css('a'));
            expect(buttons.length).toBe(1);
            buttons[0].nativeElement.click();
            fixture.detectChanges();
            let de = fixture.debugElement.queryAll(By.css('li'));
            expect(de.length).toBe(1);
          });
      }));
  });
}

class CommentServiceSpy {
}

@Pipe({
  name: 'localDate',
  pure: true
})
export class LocalDatePipe implements PipeTransform {

  transform(input: Array<number>): string {
    return '';
  }
}

@Component({
  selector: 'qddt-comment-create',
  template: `<div></div>`
})

class CommentCreateComponent {
    @Input() ownerId: any;
}

@Component({
  selector: 'test-component',
  template: `<qddt-comment-list [comments]="comments">
    </qddt-comment-list>`
})
class TestComponent {
    comments: any[];
}
