import { Component, Input, PipeTransform, Pipe, EventEmitter, Output } from '@angular/core';
import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';

import { ControlConstructService } from './controlconstruct.service';
import { BaseService } from '../../common/base.service';
import { InstructionComponent } from './instruction.component';
import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable }     from 'rxjs/Observable';
import { MaterializeModule } from 'angular2-materialize';

export function main() {
  describe('Instruction add component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ InstructionComponent, AutocompleteComponent ],
        providers: [
          MockBackend,
          BaseRequestOptions,
          { provide: ControlConstructService, useClass: ControlConstructServiceSpy },
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
        imports: [CommonModule, FormsModule, MaterializeModule]
      });
    });

    it('should work with null',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(InstructionComponent);
            fixture.detectChanges();
            let de: any = fixture.debugElement.queryAll(By.css('autocomplete'));
            expect(de.length).toBe(1);
          });
      }));

    it('should work with instructions',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(InstructionComponent);
            let instruction: any = {
              'id' : '7f000101-54aa-131e-8154-aa27fc230000',
              'modified' : [ 2016, 9, 8, 15, 21, 26, 254000000 ],
              'name' : 'one instruction',
              'basedOnObject' : null,
              'basedOnRevision' : null,
              'version' : {'major' : 6, 'minor' : 0, 'versionLabel' : '', 'revision' : null },
              'changeKind' : 'CONCEPTUAL',
              'changeComment' : 'Information added'
            };
            fixture.componentInstance.instruction = instruction;
            fixture.componentInstance.instructions = [instruction];
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              let de: any = fixture.debugElement.queryAll(By.css('autocomplete'));
              expect(de.length).toBeGreaterThan(0);
            });
          });
      }));
  });
}

//override dependencies
class ControlConstructServiceSpy {
  searchInstructions = jasmine.createSpy('searchInstructions').and.callFake(function (key) {
    return [];
  });
}

@Component({
  selector: 'autocomplete',
  template: `<div></div>`
})

export class AutocompleteComponent {
  @Input() items:  any[];
  @Input() searchField: any;
  @Input() placeholder: string;
  @Input() isMultipleFields: boolean;
  @Input() initialValue: string;
  @Input() searchFromServer: boolean;
  @Output() autocompleteSelectEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() autocompleteFocusEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() enterEvent: EventEmitter<any> = new EventEmitter<any>();
}
