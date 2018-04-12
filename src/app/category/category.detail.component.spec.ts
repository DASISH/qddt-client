import { Component, Input, PipeTransform, Pipe, EventEmitter, Output } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RationalComponent } from '../shared/rational/rational.component';

import { CategoryService } from './category.service';
import { CategoryDetailComponent } from './category.detail.component';
import { API_BASE_HREF } from '../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

export function main() {
  describe('Category Detail component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CategoryDetailComponent, RevisionComponent, RationalComponent, LocalDatePipe,
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
            const fixture = TestBed.createComponent(CategoryDetailComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('label'));
            expect(de.length).toBe(0);
          });
      }));

    it('should work with category',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(CategoryDetailComponent);
            const category: any = {
              'id' : '7f000101-54aa-131e-8154-aa27fc230000',
              'modified' : [ 2016, 9, 8, 15, 21, 26, 254000000 ],
              'name' : 'The European Social Survey (ESS)',
              'label' : 'The European Social Survey (ESS)',
              'basedOnObject' : null,
              'basedOnRevision' : null,
              'version' : {'major' : 6, 'minor' : 0, 'versionLabel' : '', 'revision' : null },
              'changeKind' : 'CONCEPTUAL',
              'changeComment' : 'Information added'
            };
            fixture.componentInstance.category = category;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const h5: any = fixture.debugElement.queryAll(By.css('flow-text'));
              expect(h5.length).toBeGreaterThan(0);
              expect(h5[0].nativeElement.textContent).toContain('ESS');
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
  selector: 'qddt-category-edit',
  template: `<div></div>`
})

class CategoryEditComponent {
  @Input() category: any;
  @Input() categories: any;
  @Input() isVisible: boolean;
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
  @Output() enterEvent = new EventEmitter<any>();
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
