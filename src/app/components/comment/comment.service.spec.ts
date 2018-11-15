import { TestBed, async } from '@angular/core/testing';

import { CommentService } from './comment.service';
import { API_BASE_HREF } from '../../api';

export function main() {
  describe('Comment Service', () => {

    beforeEach(() => {

      TestBed.configureTestingModule({
        providers: [
          CommentService,
          {
            provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ]
      });
    });

    it('should create comment', async(() => {
      const service = TestBed.get(CommentService);
      const comment: any = { 'ownerId': '1', 'comment': 'test' };
      service.create(comment).subscribe((data: any) => {
        expect(data.id).toBe('2');
      });
    }));

    it('should update comment', async(() => {
      const service = TestBed.get(CommentService);
      const comment: any = { id: '2', ownerId: '1', comment: 'test' };
      service.update(comment).subscribe((data: any) => {
        expect(data.comment).toBe('testa');
      });
    }));

    it('should get all of comments', async(() => {
      const service = TestBed.get(CommentService);
      service.getAll('1').subscribe((data: any) => {
        expect(data.length).toBe(1);
      });
    }));
  });
}
