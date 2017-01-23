import { LocalDatePipe } from './date_pipe';

export function main() {
  describe('LocalDatePipe', () => {
    let pipe = new LocalDatePipe();
    it('transforms date to string', () => {
      expect(pipe.transform([2017, 1, 23, 9, 51, 3, 13000000]))
        .toBe('Mon Jan 23 2017');
    });
  });

  describe('empty LocalDatePipe', () => {
    let pipe = new LocalDatePipe();
    it('transforms date to string', () => {
      expect(pipe.transform([]))
        .toBe('');
    });
  });
}
