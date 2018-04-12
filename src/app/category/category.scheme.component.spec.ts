import { Component, Input, EventEmitter, Output } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CategoryService } from './category.service';
import { CategorySchemeComponent } from './category.scheme.component';
import { API_BASE_HREF } from '../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../core/user/user.service';

export function main() {
  describe('Category scheme component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CategorySchemeComponent, RevisionComponent,
          TableComponent, CommentListComponent, RationalComponent,
          AutocompleteComponent, RevisionDetailComponent,
          CategoryDetailComponent, AuthorChipComponent],
        providers: [
          { provide: CategoryService, useClass: CategoryServiceSpy },
          { provide: UserService, useClass: UserServiceSpy },
          {
            provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ],
        imports: [CommonModule, FormsModule]
      });
      // Mock debounceTime
      Observable.prototype.debounceTime = function () { return this; };
    });

    it('should work with null',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(CategorySchemeComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('a'));
            expect(de.length).toBe(1);
          });
      }));

    it('should work with categories',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(CategorySchemeComponent);

            fixture.componentInstance.ngOnInit();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const table: any = fixture.debugElement.queryAll(By.css('qddt-table'));
              expect(table.length).toBeGreaterThan(0);
              expect(fixture.componentInstance.categories.length).toBeGreaterThan(0);
              expect(fixture.componentInstance.categories[0].name).toContain('ESS');
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

class CategoryServiceSpy {
  getByCategoryKind = jasmine.createSpy('getByCategoryKind').and.callFake(function (key) {
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
  selector: 'qddt-category-detail',
  template: `<div></div>`
})

class CategoryDetailComponent {
  @Input() category: any;
  @Input() categories: any[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent =  new EventEmitter<String>();
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
  @Output() detailEvent =  new EventEmitter<String>();
  @Output() pageChangeEvent =  new EventEmitter<String>();
  @Output() enterEvent =  new EventEmitter<any>();
}

@Component({
  selector: 'qddt-auto-complete',
  template: `<div></div>`
})

class AutocompleteComponent {
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



class RevisionComponent {
  @Input() isVisible: any;
  @Input() config: any;
  @Input() qddtURI: any;
  @Input() current: any;
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

@Component({
  selector: 'qddt-author-chip',
  template: `<div></div>`
})

class AuthorChipComponent {
  @Input() authors: any;
}
