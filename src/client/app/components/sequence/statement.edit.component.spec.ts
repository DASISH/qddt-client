import { Component, Input, PipeTransform, Pipe, EventEmitter, Output } from '@angular/core';
import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';

import { SequenceService } from './sequence.service';
import { UserService } from '../../shared/user/user.service';
import { BaseService } from '../../shared/base.service';
import { StatementEditComponent } from './statement.edit.component';
import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { MaterializeModule } from 'angular2-materialize';

export function main() {
  describe('statement edit component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ TestComponent, StatementEditComponent ],
        providers: [
          MockBackend,
          BaseRequestOptions,
          { provide: SequenceService, useClass: SequenceServiceSpy },
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
            let fixture = TestBed.createComponent(StatementEditComponent);
            fixture.detectChanges();
            let de: any = fixture.debugElement.queryAll(By.css('textarea'));
            expect(de.length).toBeGreaterThan(0);
          });
      }));

    it('should create statement',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(TestComponent);
            let mockBackend = TestBed.get(MockBackend);
            mockBackend.connections.subscribe((c: any) => {
              c.mockRespond(new Response(new ResponseOptions({
                body: '{'
                + '"id" : "7f000101-54aa-131e-8154-aa27fc230000",'
                + '"modified" : [ 2016, 9, 8, 15, 21, 26, 254000000 ],'
                + '"name" : "one statement",'
                + '"basedOnObject" : null,'
                + '"basedOnRevision" : null,'
                + '"version" : {"major" : 1, "minor" : 0, "versionLabel" : "", "revision" : null },'
                + '"changeKind" : "CREATED",'
                + '"changeComment" : "CREATED"'
                + '}'
              })));
            });
            let de: any[] = fixture.debugElement.queryAll(By.css('button'));
            expect(de.length).toBeGreaterThan(0);
            de[0].nativeElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              expect(fixture.componentInstance.element.name).toBe('one statement');
            });
          });
      }));
  });
}

//override dependencies
class SequenceServiceSpy {
  create = jasmine.createSpy('create').and.callFake(function (key) {
    return [];
  });
}

@Component({
  selector: 'qddt-test',
  template: `<div><qddt-statement-edit (element)="onElement($event)"></qddt-statement-edit></div>`
})

class TestComponent {
  element: any;

  onElement(element: any) {
    this.element = element;
  }
}
