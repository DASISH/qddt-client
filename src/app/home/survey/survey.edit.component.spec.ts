import { Component, Input } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SurveyEditComponent } from './survey.edit.component';
import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeService } from '../home.service';

export function main() {
  describe('Survey edit component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RevisionDetailComponent, RationalComponent, SurveyEditComponent],
        providers: [
          { provide: HomeService, useClass: SurveyServiceSpy },
          {
            provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ],
        imports: [CommonModule, FormsModule]
      });
    });

    it('should work with null newSurvey',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(SurveyEditComponent);
            fixture.componentInstance.isVisible = true;
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('div'));
            expect(de.length).toBeGreaterThan(0);
          });
      }));

    it('should work with surveyList',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(SurveyEditComponent);
            fixture.componentInstance.isVisible = true;
            fixture.componentInstance.survey = {
              id: '7f000101-54aa-131e-8154-aa27fc230000',
              modified: 123412431324,
              name: 'The European Social Survey (ESS)',
              description: 'test desc',
              archived: false,
              studies: [],
              classKind: 'SURVEY',
              authors: [],
              version: { major: 0, minor: 0 }
            };
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const input: any = fixture.debugElement.queryAll(By.css('input'));
              expect(input.length).toBeGreaterThan(0);
              expect(input[0].nativeNode.value).toContain('ESS');
              fixture.componentInstance.onSave();
              fixture.detectChanges();
              fixture.whenStable().then(() => {
                const content: string = fixture.debugElement.nativeElement.textContent;
                expect(content.trim()).toBe('');
              });
            });
          });
      }));

    it('should save newSurvey',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(SurveyEditComponent);
            fixture.componentInstance.isVisible = true;
            fixture.componentInstance.survey = {
              id: '7f000101-54aa-131e-8154-aa27fc230000',
              modified: 43265432524,
              name: 'The European Social Survey (ESS)',
              description: 'test desc',
              archived: false,
              studies: [],
              classKind: 'SURVEY',
              version: { major: 0, minor: 0 }
            };
            fixture.componentInstance.onSave();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const content: string = fixture.debugElement.nativeElement.textContent;
              expect(content.trim()).toBe('');
            });
          });
      }));
  });
}

// override dependencies
class SurveyServiceSpy {
  save = jasmine.createSpy('save').and.callFake(function (key) {
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
