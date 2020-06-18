// our root app component
import { Directive, Optional, SkipSelf, OnInit, OnDestroy, Input } from '@angular/core';
import { NgForm } from '@angular/forms';


@Directive({ selector: 'form[parentFormConnect]' })
export class ParentFormConnectDirective implements OnInit, OnDestroy {

  @Input() parentFormConnect = 'child';

  constructor(@Optional() @SkipSelf() private parentForm: NgForm, private form: NgForm) { }

  ngOnInit(): void {

    if (this.parentForm) {
      if (this.parentForm.form.contains(this.parentFormConnect) === true) {
        return;
      }

      this.parentForm.form.addControl(this.parentFormConnect, this.form.form);
    }
  }

  ngOnDestroy(): void {
    this.removeControlFunction();
  }

  private removeControlFunction = () => this.parentForm.form.removeControl(this.parentFormConnect);

}
