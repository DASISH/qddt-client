import { LocalDatePipe } from './date.pipe';

export function main() {
  describe('LocalDatePipe', () => {
    const pipe = new LocalDatePipe();
    it('transforms date to string', () => {
      expect(pipe.transform([2017, 1, 23, 9, 51, 3, 13000000]))
        .toBe('Mon Jan 23 2017');
    });
  });

  describe('empty LocalDatePipe', () => {
    const pipe = new LocalDatePipe();
    it('transforms date to string', () => {
      expect(pipe.transform([]))
        .toBe('');
    });
  });
}
