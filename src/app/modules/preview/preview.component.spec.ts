import { Component, Input } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { PreviewComponent } from './preview.component';
import {PublicationService} from '../../lib/services/publication.service';

export function main() {
  describe('Publication preview component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PreviewQustionitemComponent, PreviewResponsedomainComponent, PreviewComponent, CommentListComponent],
        providers: [
          { provide: PublicationService, useClass: PublicationServiceSpy },
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
            const fixture = TestBed.createComponent(PreviewComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('div'));
            expect(de.length).toBe(0);
          });
      }));

    it('should work with element',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(PreviewComponent);
            const element: any = {
                'id' : '7f000101-54aa-131e-8154-aa27fc230000',
                'modified' : [ 2016, 9, 8, 15, 21, 26, 254000000 ],
                'name' : 'one element',
                'description' : 'one element',
                'basedOnObject' : null,
                'basedOnRevision' : null,
                'version' : {'major' : 6, 'minor' : 0 },
                'changeKind' : 'CONCEPTUAL',
                'changeComment' : 'Information added',
                'classKind': 'CONCEPT'
            };
            fixture.componentInstance.element = element;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const de: any = fixture.debugElement.queryAll(By.css('textarea'));
              expect(de.length).toBeGreaterThan(0);
              expect(de[0].nativeNode.value).toContain('element');
            });
          });
      }));
  });
}

// override dependencies
class PublicationServiceSpy {
  searchPublications = jasmine.createSpy('searchPublications').and.callFake(function (key) {
    return [];
  });
}

@Component({
  selector: 'qddt-preview-responsedomain',
  template: `<div></div>`
})

class PreviewResponsedomainComponent {
  @Input() isVisible: boolean;
  @Input() responseDomain: any;
}

@Component({
  selector: 'qddt-preview-questionitem',
  template: `<div></div>`
})

class PreviewQustionitemComponent {
  @Input() element: any;
}

@Component({
  selector: 'qddt-preview-publication',
  template: `<div></div>`
})

// class PreviewComponent {
//   @Input() concepts: any[];
// }

@Component({
  selector: 'qddt-comment-list',
  template: `<div></div>`
})

class CommentListComponent {
  @Input() ownerId: any;
  @Input() comments: any;
}

// @Component({
//   selector: 'qddt-preview-questionitem',
//   template: `<div></div>`
// })

// class PreviewComponent {
//   @Input() questionItem: any;
//   @Input() concept: any;
//   @Input() editResponseDomain: boolean;
// }
