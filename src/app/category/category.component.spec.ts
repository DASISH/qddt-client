import { Component, Input, PipeTransform, Pipe, EventEmitter, Output } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Category, CategoryService } from './category.service';
import { CategoryComponent } from './category.component';
import { API_BASE_HREF } from '../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

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
  selector: 'qddt-category-edit',
  template: `<div></div>`
})

class CategoryEditComponent {
  @Input() category: any;
  @Input() categories: any;
  @Input() isVisible: boolean;
}

@Component({
  selector: 'qddt-category-detail',
  template: `<div></div>`
})

class CategoryDetailComponent {
  @Input() category: any;
  @Input() categories: any[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();
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

@Pipe({
  name: 'localDate',
  pure: true
})
export class LocalDatePipe implements PipeTransform {

  transform(input: Array<number>): string {
    return '';
  }
}


export function main() {
  describe('Category component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CategoryComponent, RevisionComponent, LocalDatePipe,
          TableComponent, CategoryEditComponent, CommentListComponent,
          CategoryDetailComponent, AuthorChipComponent],
        providers: [
          { provide: CategoryService, useClass: CategoryServiceSpy },
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
            const fixture = TestBed.createComponent(CategoryComponent);
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
            const fixture = TestBed.createComponent(CategoryComponent);
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
