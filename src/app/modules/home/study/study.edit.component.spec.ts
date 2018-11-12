import { Component, Input,  } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { StudyEditComponent } from './study.edit.component';
import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import {HomeService} from '../home.service';

export function main() {
  describe('Study edit component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RevisionDetailComponent, RationalComponent, StudyEditComponent],
        providers: [
          { provide: HomeService, useClass: StudyServiceSpy },
          {
            provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ],
        imports: [CommonModule, FormsModule, MaterializeModule]
      });
    });

    it('should work with null newStudy',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(StudyEditComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('div'));
            expect(de.length).toBeGreaterThan(0);
          });
      }));

    it('should work with studies',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(StudyEditComponent);
            fixture.componentInstance.study = {
              id: '7f000101-54aa-131e-8154-aa27fc230000',
              name: 'one newStudy',
              description: '',
              authors: [],
              comments: [],
              topicGroups: [],
              classKind: 'STUDY',
              archived: false,
              modified: 43253234,
              version: { major: 0, minor: 0 }
            };
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const input: any = fixture.debugElement.queryAll(By.css('input'));
              expect(input.length).toBeGreaterThan(0);
              expect(input[0].nativeNode.value).toContain('study');
              fixture.componentInstance.onSave();
              fixture.detectChanges();
              // fixture.whenStable().then(() => {
              //   expect(fixture.componentInstance).t();
              // });
            });
          });
      }));

    it('should save topic',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(StudyEditComponent);
            fixture.componentInstance.study = {
              id: '7f000101-54aa-131e-8154-aa27fc230000',
              name: 'one newStudy',
              description: '',
              authors: [],
              archived: false,
              topicGroups: [],
              classKind: 'STUDY',
              modified: 0,
              version: { major: 0, minor: 0 }
            };
            fixture.componentInstance.onSave();
            fixture.detectChanges();
            // fixture.whenStable().then(() => {
            //   expect(fixture.componentInstance.isVisible).toBeFalsy();
            // });
          });
      }));
  });
}

// override dependencies
class StudyServiceSpy {
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
