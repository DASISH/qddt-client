import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';
@Directive({
  selector: '[gravatar]'
})
export class GravatarDirective implements OnChanges, OnInit {
  @Input() email: string;
  @Input() size = 16;
  @Input() fallback = 'mm';

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    this.setUrlGravatar(this.email);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.email) {
      this.setUrlGravatar(changes.email.currentValue);
    }
  }

  setUrlGravatar(email: string) {
    // this.elementRef.nativeElement.src = `//www.gravatar.com/avatar/&d=${this.fallback}`;
    this.elementRef.nativeElement.src = `//www.gravatar.com/avatar/${Md5.hashStr(email)}?s=${this.size}&d=${this.fallback}`;
  }
}
