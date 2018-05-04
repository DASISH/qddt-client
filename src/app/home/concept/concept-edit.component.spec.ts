import { Component, Input } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ConceptEditComponent } from './concept-edit.component';
import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { HomeService } from '../home.service';

export function main() {
  describe('Concept edit component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ConceptEditComponent, RevisionDetailComponent,
          CommentListComponent, RationalComponent],
        providers: [
          { provide: HomeService, useClass: ConceptServiceSpy },
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
            const fixture = TestBed.createComponent(ConceptEditComponent);
            fixture.detectChanges();
            const de: any = fixture.debugElement.queryAll(By.css('div'));
            expect(de.length).toBe(0);
            fixture.componentInstance.isVisible = true;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const de1: any = fixture.debugElement.queryAll(By.css('div'));
              expect(de1.length).toBeGreaterThan(0);
            });
          });
      }));

    it('should work with concept',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            const fixture = TestBed.createComponent(ConceptEditComponent);
            const concept: any = {
                'id' : '7f000101-54aa-131e-8154-aa27fc230000',
                'modified' : [ 2016, 9, 8, 15, 21, 26, 254000000 ],
                'name' : 'one concept',
                'basedOnObject' : null,
                'basedOnRevision' : null,
                'version' : {'major' : 6, 'minor' : 0, 'versionLabel' : '', 'revision' : null },
                'changeKind' : 'CONCEPTUAL',
                'changeComment' : 'Information added'
                };
            fixture.componentInstance.concept = concept;
            fixture.componentInstance.isVisible = true;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              const form: any = fixture.debugElement.queryAll(By.css('form'));
              expect(form.length).toBeGreaterThan(0);
            });
          });
      }));
  });
}

// override dependencies
class ConceptServiceSpy {
  updateConcept = jasmine.createSpy('updateConcept').and.callFake(function (key) {
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
