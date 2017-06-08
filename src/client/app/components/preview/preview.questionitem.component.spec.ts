import { Component, Input, PipeTransform, Pipe, EventEmitter, Output } from '@angular/core';
import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';

import { PublicationService } from '../publication/publication.service';
import { UserService } from '../../common/user.service';
import { BaseService } from '../../common/base.service';
import { PreviewQuestionitemComponent } from './preview.questionitem.component';
import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable }     from 'rxjs/Observable';
import { MaterializeModule } from 'angular2-materialize';

export function main() {
  describe('Publication questionitem preview component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ PreviewQuestionitemComponent, ResponsedomainPreviewComponent],
        providers: [
          MockBackend,
          BaseRequestOptions,
          { provide: PublicationService, useClass: PublicationServiceSpy },
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
            let fixture = TestBed.createComponent(PreviewQuestionitemComponent);
            fixture.detectChanges();
            let de: any = fixture.debugElement.queryAll(By.css('div'));
            expect(de.length).toBe(0);
          });
      }));

    it('should work with questionitem',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(PreviewQuestionitemComponent);
            let element: any = {
                'id' : '7f000101-54aa-131e-8154-aa27fc230000',
                'modified' : [ 2016, 9, 8, 15, 21, 26, 254000000 ],
                'name' : 'one questionitem',
                'description' : 'one questionitem',
                'question': {'question': 'test'},
                'basedOnObject' : null,
                'basedOnRevision' : null,
                'version' : {'major' : 6, 'minor' : 0, 'versionLabel' : '', 'revision' : null },
                'changeKind' : 'CONCEPTUAL',
                'changeComment' : 'Information added'
            };
            fixture.componentInstance.element = element;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              let de: any = fixture.debugElement.queryAll(By.css('li'));
              expect(de.length).toBeGreaterThan(3);
              expect(de[3].nativeNode.textContent).toContain('test');
            });
          });
      }));
  });
}

//override dependencies
class PublicationServiceSpy {
  searchPublications = jasmine.createSpy('searchPublications').and.callFake(function (key) {
    return [];
  });
}

@Component({
  selector: 'qddt-responsedomain-preview',
  template: `<div></div>`
})

class ResponsedomainPreviewComponent {
  @Input() isVisible: boolean;
  @Input() responseDomain: any;
}
