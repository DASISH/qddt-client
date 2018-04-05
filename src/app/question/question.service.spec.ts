import { TestBed, async } from '@angular/core/testing';

import { QuestionService } from './question.service';
import { API_BASE_HREF } from '../api';

export function main() {
  describe('Question service', () => {

    beforeEach(() => {

      TestBed.configureTestingModule({
        providers: [
          QuestionService,
          {
            provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ]
      });
    });

    it('should update question', async(() => {
      const service = TestBed.get(QuestionService);
      const question: any = { id: '2', name: 'test' };
      service.updateQuestionItem(question).subscribe((data: any) => {
        expect(data.name).toBe('question');
      });
    }));

    it('should get all of questions', async(() => {
      const service = TestBed.get(QuestionService);
      service.getQuestionItemPage('1').subscribe((data: any) => {
        expect(data.length).toBe(1);
        expect(data[0].name).toContain('question');
      });
    }));
  });
}
