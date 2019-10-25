import { Component, Input, EventEmitter, Output } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConditionEditComponent } from './conditionconstruct.edit.component';
import {TemplateService} from '../../../lib/services';
import {API_BASE_HREF} from '../../../api';

export function main() {
  describe('Condition edit component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ ConditionEditComponent, RevisionComponent,
          QddtAutoCompleteComponent ],
        providers: [
          { provide: TemplateService, useClass: SequenceServiceSpy },
          {
            provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ],
        imports: [CommonModule, FormsModule]
      });
      // Mock debounceTime
      // Observable.prototype.debounceTime = function () { return this; };
    });

    it('should work with null',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(ConditionEditComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('textarea'));
            expect(de.length).toBeGreaterThan(0);
            fixture.componentInstance.ngOnInit();
            fixture.componentInstance.condition['name'] = 'test';
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const de1: any = fixture.debugElement.queryAll(By.css('textarea'));
              expect(de1.length).toBeGreaterThan(0);
              expect(de1[0].nativeElement.value).toBe('test');
            });
          });
      }));

    it('should work with searching',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(ConditionEditComponent);
/*             const mockBackend = TestBed.get(MockBackend);
            mockBackend.connections.subscribe((c: any) => {
              c.mockRespond(new Response(new ResponseOptions({
                body: '{"content":[{'
                + '"id" : "7f000101-54aa-131e-8154-aa27fc230000",'
                + '"modified" : [ 2016, 9, 8, 15, 21, 26, 254000000 ],'
                + '"name" : "one condition",'
                + '"basedOnObject" : null,'
                + '"basedOnRevision" : null,'
                + '"version" : {"major" : 6, "minor" : 0, "versionLabel" : "", "revision" : null },'
                + '"changeKind" : "CONCEPTUAL",'
                + '"changeComment" : "Information added"'
                + '}],'
                + '"page" : { "size" : 20, "totalElements" : 1, "totalPages" : 1, "number" : 0}}'
              })));
            });
 */            fixture.componentInstance.onSearchElements('test');
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              expect(fixture.componentInstance.elements.length).toBeGreaterThan(0);
              expect(fixture.componentInstance.elements[0].name).toContain('condition');
            });
          });
      }));
  });
}

// override dependencies
class SequenceServiceSpy {
  getElements = jasmine.createSpy('getElements').and.callFake(function (key) {
    return [];
  });
  create = jasmine.createSpy('create').and.callFake(function (key) {
    return [];
  });
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
  selector: 'qddt-autocomplete',
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
