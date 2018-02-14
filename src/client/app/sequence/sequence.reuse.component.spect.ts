import { Component, Input, EventEmitter, Output } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SequenceService } from './sequence.service';
import { SequenceReuseComponent } from './sequence.reuse.component';
import { API_BASE_HREF } from '../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';

export function main() {
  describe('Sequence reuse component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RevisionComponent,
          SequenceReuseComponent, CommentListComponent,
          RationalComponent, AutocompleteComponent,
          AuthorChipComponent, SequenceContentComponent],
        providers: [
          { provide: SequenceService, useClass: SequenceServiceSpy },
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
            const fixture = TestBed.createComponent(SequenceReuseComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('input'));
            expect(de.length).toBe(0);
          });
      }));

    it('should work with autocomplete',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(SequenceReuseComponent);
            // fixture.componentInstance.showAddElement = true;
            fixture.componentInstance.onSearchElements('test');
            fixture.detectChanges();
            // fixture.whenStable().then(() => {
            //   expect(fixture.componentInstance.elements.length).toBeGreaterThan(0);
            //   expect(fixture.componentInstance.elements[0].name).toBe('one sequence');
            // });
          });
      }));
  });
}

//override dependencies
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
  selector: 'qddt-rational',
  template: `<div></div>`
})

class RationalComponent {
  @Input() element: any;
  @Input() config: any;
}

@Component({
  selector: 'qddt-sequence-content',
  template: `<div></div>`
})

class SequenceContentComponent {
  @Input() sequence: any;
}

@Component({
  selector: 'autocomplete',
  template: `<div></div>`
})

class AutocompleteComponent {
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
