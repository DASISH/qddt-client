import { Component, Input, EventEmitter, Output } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { MaterializeModule } from 'angular2-materialize';
import { SequenceConstructComponent } from './sequenceconstruct.component';
import { ControlConstructService } from '../controlconstruct.service';
import { HttpClient } from '@angular/common/http';

export function main() {
  describe('Sequence component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SequenceConstructComponent, RevisionComponent,
          SequenceReuseComponent, CommentListComponent,
          SequenceDetailComponent,
          AuthorChipComponent, TableComponent],
        providers: [
          { provide: ControlConstructService, useClass: SequenceServiceSpy },
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
            const fixture = TestBed.createComponent(SequenceConstructComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('form'));
            expect(de.length).toBe(0);
            fixture.componentInstance.onToggleSequenceForm();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const de: any = fixture.debugElement.queryAll(By.css('form'));
              expect(de.length).toBeGreaterThan(0);
            });
          });
      }));

    it('should work with searching',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(SequenceConstructComponent);
            fixture.componentInstance.ngOnInit();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              expect(fixture.componentInstance.sequences.length).toBeGreaterThan(0);
              expect(fixture.componentInstance.sequences[0].name).toContain('sequence');
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
  selector: 'qddt-sequence-detail',
  template: `<div></div>`
})

class SequenceDetailComponent {
  @Input() sequence: any;
  @Input() sequences: any[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();
}

@Component({
  selector: 'qddt-sequence-reuse',
  template: `<div></div>`
})

class SequenceReuseComponent {
  @Output() element: any = new EventEmitter<any>();
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
