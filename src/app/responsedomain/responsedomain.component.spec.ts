import { Component, Input, PipeTransform, Pipe, EventEmitter, Output } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ResponseDomainService } from './responsedomain.service';
import { ResponsedomainComponent } from './responsedomain.component';
import { API_BASE_HREF } from '../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { MaterializeModule } from 'angular2-materialize';
import { UserService } from '../core/user/user.service';

export function main() {
  describe('Responsedomain component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ResponsedomainComponent, RevisionComponent, LocalDatePipe,
          TableComponent, CommentListComponent, AuthorChipComponent,
          ResponsedomainFormComponent, ResponsedomainPreviewComponent,
          ResponsedomainReuseComponent],
        providers: [
          { provide: ResponseDomainService, useClass: ResponseDomainServiceSpy },
          { provide: UserService, useClass: UserServiceSpy },
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
            const fixture = TestBed.createComponent(ResponsedomainComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('a'));
            expect(de.length).toBeGreaterThan(0);
          });
      }));

    it('should work with responseDomains',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(ResponsedomainComponent);
            fixture.componentInstance.ngOnInit();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const table: any = fixture.debugElement.queryAll(By.css('qddt-table'));
              expect(table.length).toBeGreaterThan(0);
              expect(fixture.componentInstance.responseDomains.length).toBeGreaterThan(0);
              expect(fixture.componentInstance.responseDomains[0].name).toContain('responseDomain');
            });
          });
      }));
  });
}

// override dependencies
class UserServiceSpy {
  get = jasmine.createSpy('get').and.callFake(function (key) {
    return {};
  });

  set = jasmine.createSpy('set').and.callFake(function (key) {
    return {};
  });
}

class ResponseDomainServiceSpy {
  getAll = jasmine.createSpy('getAll').and.callFake(function (key) {
    return [];
  });
}

@Component({
  selector: 'qddt-comment-list',
  template: `<div></div>`
})

class CommentListComponent {
  @Input() ownerId: any;
  @Input() comments: any[];
}

@Component({
  selector: 'qddt-responsedomain-form',
  template: `<div></div>`
})

class ResponsedomainFormComponent {
  @Input() responsedomain: any;
  @Input() domainType: any;
  @Input() readonly: boolean;
  @Output() formChange: EventEmitter<any>;
}

@Component({
  selector: 'qddt-table',
  template: `<div></div>`
})

class TableComponent {
  @Input() page: any;
  @Input() columns: any[];
  @Input() items: any[];
  @Input() placeholder: string;

  @Input() searchFromServer: boolean;
  @Output() detailEvent: EventEmitter<String> = new EventEmitter<String>();
  @Output() pageChangeEvent: EventEmitter<String> = new EventEmitter<String>();
  @Output() enterEvent: EventEmitter<any> = new EventEmitter<any>();
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
  selector: 'qddt-author-chip',
  template: `<div></div>`
})

class AuthorChipComponent {
  @Input() authors: any;
}

@Component({
  selector: 'qddt-preview-responsedomain',
  template: `<div></div>`
})

class ResponsedomainPreviewComponent {
  @Input() isVisible: boolean;
  @Input() responseDomain: any;
}

@Component({
  selector: 'qddt-responsedomain-reuse',
  template: `<div></div>`
})

class ResponsedomainReuseComponent {
  @Input() isVisible: boolean;
  @Input() responseDomain: any;
  @Output() responseDomainReuse: EventEmitter<any> = new EventEmitter();
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
