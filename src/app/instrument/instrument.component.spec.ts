import { Component, Input, PipeTransform, Pipe, EventEmitter, Output } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { InstrumentService } from './instrument.service';
import { InstrumentComponent } from './instrument.component';
import { API_BASE_HREF } from '../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';

export function main() {
  describe('Instrument component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [InstrumentComponent, RevisionComponent,
          LocalDatePipe, InstrumentDetailComponent,
          CommentListComponent, AuthorChipComponent,
          TableComponent],
        providers: [
          { provide: InstrumentService, useClass: InstrumentServiceSpy },
          {
            provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ],
        imports: [CommonModule, FormsModule, MaterializeModule]
      });
    });

    it('should work with null instrument',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(InstrumentComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('a'));
            expect(de.length).toBeGreaterThan(1);
          });
      }));

    it('should create instrument',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(InstrumentComponent);
            fixture.componentInstance.showInstrumentForm = true;
            fixture.componentInstance.onCreateInstrument();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const de: any = fixture.debugElement.queryAll(By.css('qddt-table'));
              expect(de.length).toBeGreaterThan(0);
              expect(fixture.componentInstance.showInstrumentForm).toBeFalsy();
            });
          });
      }));
  });
}

// override dependencies
class InstrumentServiceSpy {
  create = jasmine.createSpy('create').and.callFake(function (key) {
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
  selector: 'qddt-instrument-detail',
  template: `<div></div>`
})

class InstrumentDetailComponent {
  @Input() instrument: any;
  @Input() instruments: any[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();
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
