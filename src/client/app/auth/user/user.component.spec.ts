import { Component, EventEmitter, Output } from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';
import { UserLoginComponent } from './user.component';
import { By } from '@angular/platform-browser';
import { AuthService } from '../auth.service';

export function main() {
  describe('User component', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [UserLoginComponent, LoginComponent],
        providers: [
          { provide: AuthService, useClass: UserServiceSpy }
        ],
        imports: []
      });
    });

    it('should get username',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(UserLoginComponent);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              let de = fixture.debugElement.queryAll(By.css('.s4'));
              expect(de.length).toBeGreaterThan(1);
              expect(de[1].nativeElement.textContent.indexOf('qddt')).toBeGreaterThan(0);
              expect(fixture.componentInstance.user['username']).toContain('qddt');
            });
          });
      }));
  });
}

//override dependencies
class UserServiceSpy {
  get = jasmine.createSpy('get').and.callFake(function (key) {
    return { username: 'qddt', email: 'test@qddt.no' };
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
