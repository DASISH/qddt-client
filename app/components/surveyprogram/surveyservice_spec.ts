import {SurveyService} from './surveyservice';
import {Inject} from 'angular2/angular2';
import {Http, HTTP_PROVIDERS} from 'angular2/http';

export function main(@Inject(Http) http: Http) {
  describe('SurveyService Service', () => {
    let surveyService;

    beforeEach(() => {
      surveyService = new SurveyService(http);
    });

    it('should return the list of names', () => {
      let surveys = surveyService.getAll();
      expect(surveys).toEqual(jasmine.any(Array));
    });
  });
}
