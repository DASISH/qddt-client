import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import {
  async,
  inject,
  TestBed
} from '@angular/core/testing';

import { UserService } from './shared/user/user.service';
import { AppComponent } from './app.component';
import { By } from '@angular/platform-browser';

class UserServiceSpy {
  get = jasmine.createSpy('get').and.callFake(function(key) {
    return { username: 'qddt', email: 'test@qddt.no' };
  });

  getGlobalObject = jasmine.createSpy('getGlobalObject').and.callFake(function(key) {
    return { current: '' };
  });

  setGlobalObject = jasmine.createSpy('setGlobalObject').and.callFake(function(key) {
    return { current: '' };
  });
}

@Component({
  template: ''
})
class DummyComponent {
}

@Component({
  selector: 'qddt-user-login',
  moduleId: module.id,
  template: ''
})
export class UserLoginComponent {
  @Output() logoutEvent: EventEmitter<string> = new EventEmitter<string>();
}

export function main() {
  describe('App component', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, DummyComponent, AppComponent, UserLoginComponent],
        providers: [
          { provide: UserService, useClass: UserServiceSpy }
        ],
        imports: [
          CommonModule,
          RouterTestingModule.withRoutes([
            { path: 'home', component: DummyComponent },
            { path: 'questions', component: DummyComponent },
            { path: 'categories', component: DummyComponent },
            { path: 'schemes', component: DummyComponent },
            { path: 'responsedomains', component: DummyComponent },
            { path: 'constructs', component: DummyComponent },
            { path: 'instruments', component: DummyComponent },
            { path: 'sequences', component: DummyComponent }
          ])
        ]
      });
    });

    it('should go to starting page',
      async(() => {
        TestBed
          .compileComponents()
          .then((inject([Router, Location], (router: Router, location: Location) => {
            let fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              expect(location.path()).toEqual('');
            });
          })));
      }));
      it('should go to Categories page',
        async(() => {
          TestBed
            .compileComponents()
            .then((inject([Router, Location], (router: Router, location: Location) => {
              let fixture = TestBed.createComponent(TestComponent);
              fixture.detectChanges();
              fixture.whenStable().then(() => {
                let de = fixture.debugElement.queryAll(By.css('a'));
                expect(de.length).toBeGreaterThan(2);
                de[2].nativeElement.click();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                  expect(location.path()).toEqual('/categories');
                });
              });
          })));
        }));
    });
}

@Component({
    selector: 'test-cmp',
    template: '<app></app>'
})
class TestComponent {

}
