import { Component, Input, PipeTransform, Pipe } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RevisionService } from '../revision/revision.service';
import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { RevisionComponent } from '../revision/revision.component';
import { Topic } from '../../classes';

export function main() {
  describe('Revision detail component', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RevisionComponent, LocalDatePipe,
          DiffComponent, ResponsedomainUsedbyComponent, QuestionUsedbyComponent,
          StudyUsedbyComponent, TopicUsedbyComponent, AuthorChipComponent],
        providers: [
          { provide: RevisionService, useClass: RevisionServiceSpy },
          {
            provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ],
        imports: [CommonModule, FormsModule, MaterializeModule]
      });
    });

    it('should work with null revision',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(RevisionComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('div'));
            expect(de.length).toBe(0);
          });
      }));
    it('should work with revisions',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(RevisionComponent);
            fixture.componentInstance.current = new Topic( {
              'id': '7f000101-5582-1585-8155-e89cdeba0001',
              'modified': 23948719853794585,
              'modifiedBy': {
                'id': '83d4c30a-4ff9-11e5-885d-feff819cdc9f',
                'username': 'test',
                'email': 'test@nsd.no'
              },
              'agency': {
                'id': '1359dede-9f18-11e5-8994-feff819cdc9f',
                'name': 'NSD-qddt',
                'classKind': ''
              },
              'name': 'test',
              'basedOnObject': null,
              'basedOnRevision': null,
              'version': {
                'major': 1,
                'minor': 0,
                'versionLabel': '',
                'revision': null
              },
              'authors': [],
              'otherMaterials': [],
              'description': 'test',
              'comments': [],
              'topicQuestionItems': []
            });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const divs: any = fixture.debugElement.queryAll(By.css('.chip'));
              expect(divs.length).toBeGreaterThan(2);
              expect(divs[0].nativeNode.textContent).toContain('1.0');
              expect(divs[2].nativeNode.textContent).toContain('test');
            });
          });
      }));
  });
}

// override dependencies
class RevisionServiceSpy {
  getAllRevisions = jasmine.createSpy('getAllRevisions').and.callFake(function (key) {
    return [];
  });
}

@Component({
  selector: 'qddt-diff',
  template: `<div></div>`
})

class DiffComponent {
  @Input() compared: any;
  @Input() current: any;
  @Input() config: any;
  @Input() hideCompareEvent: any;
}

@Component({
  selector: 'qddt-preview-responsedomain',
  template: `<div></div>`
})

class ResponsedomainUsedbyComponent {
  @Input() id: any;
}

@Component({
  selector: 'qddt-preview-question',
  template: `<div></div>`
})

class QuestionUsedbyComponent {
  @Input() id: any;
}

@Component({
  selector: 'qddt-preview-topic',
  template: `<div></div>`
})

class TopicUsedbyComponent {
  @Input() id: any;
}

@Component({
  selector: 'qddt-preview-study',
  template: `<div></div>`
})

class StudyUsedbyComponent {
  @Input() id: any;
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
