import { Component, Input,  EventEmitter, Output } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { API_BASE_HREF } from '../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { ResponsedomainSelectMissingComponent } from './responsedomain.select-missing.component';
import { QuestionService } from '../question/question.classes';
import { Observable } from 'rxjs/Observable';

export function main() {
  describe('Question edit missing component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
          ResponsedomainSelectMissingComponent, QddtAutoCompleteComponent,
        ],
        providers: [
          { provide: QuestionService, useClass: QuestionServiceSpy },
          {
            provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ],
        imports: [CommonModule, FormsModule, MaterializeModule]
      });
      // Mock debounceTime
      Observable.prototype.debounceTime = function () { return this; };
    });

    it('should work with null',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(ResponsedomainSelectMissingComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('a'));
            expect(de.length).toBeGreaterThan(0);
          });
      }));

    it('should work with missing',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(ResponsedomainSelectMissingComponent);
            fixture.componentInstance.ngOnInit();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const elements: any = fixture.debugElement.queryAll(By.css('span'));
              expect(elements.length).toBeGreaterThan(1);
              expect(elements[1].nativeElement.textContent).toContain('missing');
            });
          });
      }));
  });
}

// override dependencies
class QuestionServiceSpy {
  getAllTemplatesByCategoryKind = jasmine.createSpy('getAllTemplatesByCategoryKind').and.callFake(function (key) {
    return [];
  });
}

@Component({
  selector: 'qddt-auto-complete',
  template: `<div></div>`
})

class QddtAutoCompleteComponent {
  @Input() items:  any[];
  @Input() searchField: any;
  @Input() placeholder: string;
  @Input() isMultipleFields: boolean;
  @Input() initialValue: string;
  @Input() searchFromServer: boolean;
  @Output() selectEvent =  new EventEmitter<any>();
  @Output() focusEvent =  new EventEmitter<any>();
  @Output() enterEvent =  new EventEmitter<any>();
}
