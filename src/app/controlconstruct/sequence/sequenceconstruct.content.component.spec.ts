import { Component, Input,  EventEmitter, Output } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { SequenceContentComponent } from './sequenceconstruct.content.component';
import { ControlConstructService } from '../controlconstruct.service';

export function main() {
  describe('Sequence content component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SequenceContentComponent,
          PreviewSequenceComponent, CommentListComponent,
          PreviewConditionComponent, PreviewStatementComponent,
          PreviewControlConstructComponent, PreviewConstructComponent],
        providers: [
          { provide: ControlConstructService, useClass: SequenceServiceSpy },
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
            const fixture = TestBed.createComponent(SequenceContentComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('ul'));
            expect(de.length).toBe(1);
          });
      }));

    it('should work with preview',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(SequenceContentComponent);
            const element: any = {
                'id' : '7f000101-54aa-131e-8154-aa27fc230000',
                'modified' : [ 2016, 9, 8, 15, 21, 26, 254000000 ],
                'name' : 'one condition',
                'classKind': 'CONDITION_CONSTRUCT',
                'basedOnObject' : null,
                'basedOnRevision' : null,
                'version' : {'major' : 6, 'minor' : 0, 'versionLabel' : '', 'revision' : null },
                'changeKind' : 'CONCEPTUAL',
                'changeComment' : 'Information added'
                };
            fixture.componentInstance.onSelectedElement(element);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const de: any[] = fixture.debugElement.queryAll(By.css('.modal-content'));
              expect(de.length).toBe(1);
              const preview: any[] = fixture.debugElement.queryAll(By.css('qddt-preview-conditionconstruct'));
              expect(preview.length).toBe(1);
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
  selector: 'qddt-preview-sequenceconstruct',
  template: `<div></div>`
})

class PreviewSequenceComponent {
  @Input() sequence: any;
}

@Component({
  selector: 'qddt-preview-conditionconstruct',
  template: `<div></div>`
})

class PreviewConditionComponent {
  @Input() condition: any;
}

@Component({
  selector: 'qddt-preview-controlconstruct',
  template: `<div></div>`
})

class PreviewConstructComponent {
  @Input() construct: any;
}

@Component({
  selector: 'qddt-preview-questionconstruct-',
  template: `<div></div>`
})

class PreviewControlConstructComponent {
  @Input() controlConstruct: any;
}

@Component({
  selector: 'qddt-preview-statementconstruct',
  template: `<div></div>`
})

class PreviewStatementComponent {
  @Input() statement: any;
}
