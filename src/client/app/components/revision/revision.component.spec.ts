import { Component, Input, PipeTransform, Pipe } from '@angular/core';
import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';

import { RevisionService } from './revision.service';
import { BaseService } from '../../common/base.service';
import { RevisionComponent } from './revision.component';
import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export function main() {
  describe('Revision component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RevisionComponent, RevisionComponent, LocalDatePipe,
          DiffComponent],
        providers: [
          MockBackend,
          BaseRequestOptions,
          { provide: RevisionService, useClass: RevisionServiceSpy },
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

    it('should work with null revision',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(RevisionComponent);
            fixture.componentInstance.isVisible = true;
            fixture.detectChanges();
            let de: any = fixture.debugElement.queryAll(By.css('div'));
            expect(de.length).toBeGreaterThan(1);
          });
      }));

    it('should work with revisions',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(RevisionComponent);
            fixture.componentInstance.isVisible = true;
            fixture.componentInstance.qddtURI = '1';
            let mockBackend = TestBed.get(MockBackend);
            mockBackend.connections.subscribe((c: any) => {
              c.mockRespond(new Response(new ResponseOptions({
                body: '{"content":'
                  + '[{'
                  + '"entity": {"id" : "7f000101-54aa-131e-8154-aa27fc230000",'
                  + '"modified" : [ 2016, 9, 8, 15, 21, 26, 254000000 ],'
                  + '"name" : "one topic",'
                  + '"basedOnObject" : null,'
                  + '"basedOnRevision" : null,'
                  + '"version" : {"major" : 6, "minor" : 0, "versionLabel" : "", "revision" : null },'
                  + '"changeKind" : "CONCEPTUAL",'
                  + '"changeComment" : "Information added"}'
                  + '}]'
                  + '}'
              })));
            });
            fixture.componentInstance.ngOnInit();
            fixture.componentInstance.ngOnChanges();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              let td: any = fixture.debugElement.queryAll(By.css('td'));
              expect(td.length).toBe(7);
              expect(td[6].nativeNode.textContent).toContain('Information added');
            });
          });
      }));
  });
}

//override dependencies
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

@Pipe({
  name: 'localDate',
  pure: true
})
export class LocalDatePipe implements PipeTransform {

  transform(input: Array<number>): string {
    return '';
  }
}
