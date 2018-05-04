import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { CommentCreateComponent } from './comment.create.component';
import { CommentService } from './comment.service';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { API_BASE_HREF } from '../../api';

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
          { provide: CommentService, useClass: CommentServiceSpy },
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
            const fixture = TestBed.createComponent(TestComponent);
            const de = fixture.debugElement.query(By.css('textarea'));
            expect(de.nativeElement).not.toBeNull();
            const compiled: any = de.nativeElement;
            compiled.value = 'test';
            fixture.detectChanges();
            const button = fixture.debugElement.query(By.css('button'));
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
    (updatedEvent)="onAddedCommentEvent($event)">
    </qddt-comment-create>`
})
class TestComponent {
  comment: any;

  onAddedCommentEvent(comment: any) {
    this.comment = comment;
  }

}
