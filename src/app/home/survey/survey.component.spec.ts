import { Component, Input, PipeTransform, Pipe } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SurveyService } from './survey.service';
import { SurveyComponent } from './survey.component';
import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export function main() {
  describe('Survey component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SurveyComponent, RevisionComponent, LocalDatePipe,
          CommentListComponent, SurveyEditComponent, AuthorChipComponent],
        providers: [
          { provide: SurveyService, useClass: SurveyServiceSpy },
          {
            provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ],
        imports: [CommonModule, FormsModule]
      });
    });

    it('should work with null survey',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(SurveyComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('a'));
            expect(de.length).toBeGreaterThan(1);
          });
      }));

    it('should work with surveys',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(SurveyComponent);
            fixture.componentInstance.ngOnInit();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const de: any = fixture.debugElement.queryAll(By.css('qddt-revision'));
              expect(de.length).toBeGreaterThan(0);
              const h5: any = fixture.debugElement.queryAll(By.css('h5'));
              expect(h5.length).toBeGreaterThan(0);
              expect(h5[0].nativeNode.textContent).toContain('ESS');
            });
          });
      }));
  });
}

//override dependencies
class SurveyServiceSpy {
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
  selector: 'qddt-revision',
  template: `<div></div>`
})

class RevisionComponent {
  @Input() isVisible: any;
  @Input() config: any;
  @Input() qddtURI: any;
  @Input() current: any;
}

@Component({
  selector: 'qddt-survey-edit',
  template: `<div></div>`
})

class SurveyEditComponent {
  @Input() survey: any;
  @Input() isVisible: boolean;
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
