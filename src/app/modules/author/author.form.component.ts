import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  AfterViewInit
} from '@angular/core';
import {
  ActionKind,
  ElementKind,
  LANGUAGE_MAP,
  TemplateService,
  Author
} from '../../lib';

@Component({
  selector: 'qddt-author-form',
  templateUrl: './author.form.component.html'
})
export class AuthorFormComponent implements AfterViewInit {
  @Input() author: Author;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<Author>();

  public readonly formId = Math.round(Math.random() * 10000);
  public readonly LANGUAGES = LANGUAGE_MAP;

  constructor(private authorService: TemplateService) {
    if (!this.author) {
      this.author = new Author();
    }
    this.readonly = !this.authorService.can(
      ActionKind.Create,
      ElementKind.AUTHOR
    );
  }

  ngAfterViewInit(): void {
    M.updateTextFields();
  }

  onSave() {
    this.authorService.update<Author>(this.author).subscribe(
      result => {
        this.author = result;
        this.modifiedEvent.emit(result);
      },
      error => {
        throw error;
      }
    );
  }
}
