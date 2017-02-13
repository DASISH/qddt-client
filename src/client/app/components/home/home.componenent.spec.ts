import { Component, Input } from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { UserService } from '../../common/user.service';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { API_BASE_HREF } from '../../api';
import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

class UserServiceSpy {
  getGlobalObject = jasmine.createSpy('getGlobalObject').and.callFake(function (key) {
    return {current: 'suvery', 'survey': {}};
  });

  get = jasmine.createSpy('get').and.callFake(function (key) {
    return null;
  });
}

export function main() {
  describe('Home component', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, HomeComponent, SurveyProgramComponent,
          StudyComponent, TopicComponent, ConceptComponent, GithubComponent],
        providers: [
          MockBackend,
          BaseRequestOptions,
          { provide: UserService, useClass: UserServiceSpy },
          {
            provide: Http,
            useFactory: (backend: ConnectionBackend, options: BaseRequestOptions) => new Http(backend, options),
            deps: [MockBackend, BaseRequestOptions]
          },
          { provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ],
        imports: [ CommonModule ]
      });
    });

    it('should work',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            let de = fixture.debugElement.query(By.css('.card-title'));
            expect(de).not.toBeNull();
            expect(de.nativeElement).not.toBeNull();
            expect(de.nativeElement.textContent).toContain('Welcome QDDT');
          });
      }));
  });
}

@Component({
  selector: 'surveyprogram',
  template: `<div>
    </div>`
})
class SurveyProgramComponent {
  @Input() show: boolean;
}

@Component({
  selector: 'study',
  template: `<div>
    </div>`
})
class StudyComponent {
  @Input() show: boolean;
  @Input() survey: any;
}

@Component({
  selector: 'topic',
  template: `<div>
    </div>`
})
class TopicComponent {
  @Input() show: boolean;
  @Input() study: any;
}

@Component({
  selector: 'concept',
  template: `<div>
    </div>`
})
class ConceptComponent {
  @Input() show: boolean;
  @Input() topic: any;
}

@Component({
  selector: 'qddt-commit-list',
  template: `<div>
    </div>`
})
class GithubComponent {}

@Component({
  selector: 'test-component',
  template: `<qddt-home>
    </qddt-home>`
})
class TestComponent {}
