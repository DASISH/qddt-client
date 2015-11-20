import {
  TestComponentBuilder,
  describe,
  expect,
  injectAsync,
  it
} from 'angular2/testing';
import {Component, View} from 'angular2/angular2';
import {DOM} from 'angular2/src/core/dom/dom_adapter';
import {SurveyProgramComponent} from './surveyprogram';
import {SurveyService} from './surveyservice';

export function main() {
  //describe('About component', () => {
  //  it('should work',
  //    injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
  //      return tcb.overrideTemplate(TestComponent, '<div><surveyprogram></surveyprogram></div>')
  //        .createAsync(TestComponent)
  //        .then((rootTC) => {
  //          rootTC.detectChanges();
  //
  //          let aboutInstance = rootTC.debugElement.componentViewChildren[0].componentInstance;
  //          let aboutDOMEl = rootTC.debugElement.componentViewChildren[0].nativeElement;
  //          let nameListLen = function () {
  //            return aboutInstance.list.names.length;
  //          };
  //
  //          expect(aboutInstance.list).toEqual(jasmine.any(SurveyService));
  //          expect(nameListLen()).toEqual(4);
  //          expect(DOM.querySelectorAll(aboutDOMEl, 'li').length).toEqual(nameListLen());
  //
  //          aboutInstance.addName({value: 'Minko'});
  //          rootTC.detectChanges();
  //
  //          expect(nameListLen()).toEqual(5);
  //          expect(DOM.querySelectorAll(aboutDOMEl, 'li').length).toEqual(nameListLen());
  //
  //          expect(DOM.querySelectorAll(aboutDOMEl, 'li')[4].textContent).toEqual('Minko');
  //        });
  //    }));
  //});
}

@Component({bindings: [SurveyService], selector: 'test-cmp'})
@View({directives: [SurveyProgramComponent]})
class TestComponent {}
