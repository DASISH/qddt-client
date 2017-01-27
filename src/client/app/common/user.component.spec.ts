import { Component, EventEmitter, Output } from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';
import { UserLogin } from './user.component';
import { UserService } from './user.service';
import { By } from '@angular/platform-browser';

class UserServiceSpy {
  get = jasmine.createSpy('get').and.callFake(function (key) {
    return { username: 'qddt', email: 'test@qddt.no' };
  });
}

export function main() {
  describe('User component', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, UserLogin, LoginComponent],
        providers: [
          { provide: UserService, useClass: UserServiceSpy }
        ],
        imports: []
      });
    });

    it('should get username',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            let de = fixture.debugElement.queryAll(By.css('.s4'));
            expect(de.length).toBeGreaterThan(1);
            let compiled: any = de[1].nativeElement;
            let hasqddt: boolean = compiled.textContent.indexOf('qddt') >= 0;
            expect(hasqddt).toBeTruthy();
          });
      }));
  });
}

@Component({
  selector: 'qddt-login',
  moduleId: module.id,
  template: '<div>login</div>'
})
export class LoginComponent {
  @Output() loginEvent: EventEmitter<string> = new EventEmitter<string>();
}

@Component({
  selector: 'test-cmp',
  template: '<user-login></user-login>'
})
class TestComponent {

}
