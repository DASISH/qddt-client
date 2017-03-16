import { Component, Input, PipeTransform, Pipe } from '@angular/core';
import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';

import { TopicService } from '../topic.service';
import { BaseService } from '../../../common/base.service';
import { TopicEditComponent } from './topic.edit.component';
import { API_BASE_HREF } from '../../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';

export function main() {
  describe('Topic edit component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RevisionDetailComponent, RationalComponent, TopicEditComponent],
        providers: [
          MockBackend,
          BaseRequestOptions,
          { provide: TopicService, useClass: TopicServiceSpy },
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

    it('should work with null topic',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(TopicEditComponent);
            fixture.componentInstance.isVisible = true;
            fixture.detectChanges();
            let de: any = fixture.debugElement.queryAll(By.css('div'));
            expect(de.length).toBeGreaterThan(0);
          });
      }));

    it('should work with topics',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(TopicEditComponent);
            fixture.componentInstance.isVisible = true;
            fixture.componentInstance.topic = {
              'id': '7f000101-54aa-131e-8154-aa27fc230000',
              'name': 'one topic',
              'abstract_description': '',
              'otherMaterials': [],
              'authors': []
            };
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              let input: any = fixture.debugElement.queryAll(By.css('input'));
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
            let fixture = TestBed.createComponent(TopicEditComponent);
            fixture.componentInstance.isVisible = true;
            fixture.componentInstance.topic = {
              'id': '7f000101-54aa-131e-8154-aa27fc230000',
              'name': 'one topic',
              'abstract_description': '',
              'otherMaterials': [],
              'authors': []
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

//override dependencies
class TopicServiceSpy {
  edit = jasmine.createSpy('edit').and.callFake(function (key) {
    return [];
  });
}

@Component({
  selector: 'qddt-revision-detail',
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
}