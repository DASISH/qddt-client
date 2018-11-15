import { Component, Input, } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TopicEditComponent } from './topic.edit.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import {HomeService} from '../home.service';

export function main() {
  describe('Topic edit component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RevisionDetailComponent, RationalComponent, TopicEditComponent],
        providers: [
          { provide: HomeService, useClass: TopicServiceSpy },
          {
            provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ],
        imports: [CommonModule, FormsModule, MaterializeModule]
      });
    });

    it('should work with null topic',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(TopicEditComponent);
            fixture.componentInstance.isVisible = true;
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('div'));
            expect(de.length).toBeGreaterThan(0);
          });
      }));

    it('should work with topics',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(TopicEditComponent);
            fixture.componentInstance.isVisible = true;
            fixture.componentInstance.topic = {
              id: '7f000101-54aa-131e-8154-aa27fc230000',
              name: 'one topic',
              description: '',
              otherMaterials: [],
              authors: [],
              topicQuestionItems: [],
              archived: false,
              concepts: [],
              classKind: 'TOPIC_GROUP',
              modified: 32543255,
              version: { major: 0, minor: 0 }
            };
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const input: any = fixture.debugElement.queryAll(By.css('input'));
              expect(input.length).toBeGreaterThan(0);
              expect(input[0].nativeNode.value).toContain('topic');
              fixture.componentInstance.onSave();
              fixture.detectChanges();
              fixture.whenStable().then(() => {
                expect(fixture.componentInstance.isVisible).toBeFalsy();
              });
            });
          });
      }));

    it('should save topic',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(TopicEditComponent);
            fixture.componentInstance.isVisible = true;
            fixture.componentInstance.topic = {
              id: '7f000101-54aa-131e-8154-aa27fc230000',
              name: 'one topic',
              description: '',
              otherMaterials: [],
              authors: [],
              topicQuestionItems: [],
              archived: false,
              concepts: [],
              modified: 4352354345,
              classKind: 'TOPIC_GROUP',
              version: { major: 0, minor: 0 }
            };
            fixture.componentInstance.onSave();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              expect(fixture.componentInstance.isVisible).toBeFalsy();
            });
          });
      }));
  });
}

// override dependencies
class TopicServiceSpy {
  edit = jasmine.createSpy('edit').and.callFake(function (key) {
    return [];
  });
}

@Component({
  selector: 'qddt-element-footer',
  template: `<div></div>`
})

class RevisionDetailComponent {
  @Input() element: any;
  @Input() type: any;
}

@Component({
  selector: 'qddt-rational',
  template: `<div></div>`
})

class RationalComponent {
  @Input() element: any;
  @Input() config: any;
}
