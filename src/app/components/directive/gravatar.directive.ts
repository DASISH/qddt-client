import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
// import * as md5 from 'md5';
const  md5 = require('md5');
@Directive({
  selector: '[gravatar]'
})
export class GravatarDirective implements OnChanges , OnInit {
  @Input() email: string;
  @Input() size = 16;
  @Input() fallback = 'mm';

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.setUrlGravatar(this.email);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['email']) {
      this.setUrlGravatar(changes['email'].currentValue);
    }
  }

  setUrlGravatar(email: string) {
    // this.elementRef.nativeElement.src = `//www.gravatar.com/avatar/&d=${this.fallback}`;
    this.elementRef.nativeElement.src = `//www.gravatar.com/avatar/${md5(email)}?s=${this.size}&d=${this.fallback}`;
  }
}
