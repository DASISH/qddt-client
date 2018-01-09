import { Component, Input } from '@angular/core';
import { BaseRequestOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';

import { SurveyService } from './survey.service';
// import { BaseService } from '../../common/base.service';
import { SurveyEditComponent } from './survey.edit.component';
import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export function main() {
  describe('Survey edit component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RevisionDetailComponent, RationalComponent, SurveyEditComponent],
        providers: [
          MockBackend,
          BaseRequestOptions,
          { provide: SurveyService, useClass: SurveyServiceSpy },
          {
            provide: Http,
            useFactory: (backend: ConnectionBackend, options: BaseRequestOptions) => new Http(backend, options),
            deps: [MockBackend, BaseRequestOptions]
          },
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
            const fixture = TestBed.createComponent(SurveyEditComponent);
            fixture.componentInstance.isVisible = true;
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('div'));
            expect(de.length).toBeGreaterThan(0);
          });
      }));

    it('should work with surveys',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(SurveyEditComponent);
            fixture.componentInstance.isVisible = true;
            fixture.componentInstance.survey = {
              'id': '7f000101-54aa-131e-8154-aa27fc230000',
              'modified': [2016, 9, 8, 15, 21, 26, 254000000],
              'name': 'The European Social Survey (ESS)',
              'description': 'test desc'
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

    it('should save survey',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(SurveyEditComponent);
            fixture.componentInstance.isVisible = true;
            fixture.componentInstance.survey = {
              'id': '7f000101-54aa-131e-8154-aa27fc230000',
              'modified': [2016, 9, 8, 15, 21, 26, 254000000],
              'name': 'The European Social Survey (ESS)',
              'description': 'test desc'
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

//override dependencies
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
