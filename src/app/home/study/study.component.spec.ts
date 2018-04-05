import { Component, Input, PipeTransform, Pipe } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { StudyComponent } from './study.component';
import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {HomeService} from '../home.service';

export function main() {
  describe('Study component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [StudyComponent, RevisionComponent, LocalDatePipe,
          StudyEditComponent, CommentListComponent, AuthorChipComponent],
        providers: [
          { provide: HomeService, useClass: StudyServiceSpy },
          {
            provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ],
        imports: [CommonModule, FormsModule]
      });
    });

    it('should work with null study',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(StudyComponent);
            // fixture.componentInstance.show = true;
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('a'));
            expect(de.length).toBeGreaterThan(1);
          });
      }));

    it('should work with studies',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(StudyComponent);
            fixture.componentInstance.ngOnInit();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const h5: any = fixture.debugElement.queryAll(By.css('h5'));
              expect(h5.length).toBeGreaterThan(0);
              expect(h5[0].nativeNode.textContent).toContain('ESS');
            });
          });
      }));
  });
}

// override dependencies
class StudyServiceSpy {
  getAll = jasmine.createSpy('getAll').and.callFake(function (key) {
    return [];
  });
}

@Component({
  selector: 'qddt-comment-list',
  template: `<div></div>`
})

class CommentListComponent {
  @Input() ownerId: any;
  @Input() comments: any[];
}

@Component({
  selector: 'qddt-study-edit',
  template: `<div></div>`
})

class StudyEditComponent {
  @Input() study: any;
  @Input() isVisible: boolean;
  @Input() surveyId: any;
}


class RevisionComponent {
  @Input() isVisible: any;
  @Input() config: any;
  @Input() qddtURI: any;
  @Input() current: any;
}

@Component({
  selector: 'qddt-author-chip',
  template: `<div></div>`
})

class AuthorChipComponent {
  @Input() authors: any;
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
