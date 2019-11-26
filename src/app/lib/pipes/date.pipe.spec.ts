import { LocalDatePipe } from './date.pipe';
import {SessionService} from '../services';

export function main(session: SessionService) {
  describe('LocalDatePipe', () => {
    const pipe = new LocalDatePipe(session);
    it('transforms date to string', () => {
      expect(pipe.transform([2017, 1, 23, 9, 51, 3, 13000000]))
        .toBe('Mon Jan 23 2017');
    });
  });

  describe('empty LocalDatePipe', () => {
    const pipe = new LocalDatePipe(session);
    it('transforms date to string', () => {
      expect(pipe.transform([]))
        .toBe('');
    });
  });
}
