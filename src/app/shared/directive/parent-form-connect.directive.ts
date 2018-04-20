//our root app component
import { Directive, Optional, SkipSelf, OnInit, OnDestroy, Input } from '@angular/core';
import { NgForm } from '@angular/forms';


@Directive({selector: 'form[parentFormConnect]'})
export class ParentFormConnectDirective implements OnInit, OnDestroy {

  @Input() parentFormConnect = 'child';

  constructor(@Optional() @SkipSelf() private parentForm: NgForm, private form: NgForm) {

    // console.log('parentFormConnect construct');
  }

  ngOnInit(): void {

    if (this.parentForm) {
      // console.log('parent register as ' + this.parentFormConnect);

      if (this.parentForm.form.contains(this.parentFormConnect) === true) {

        alert('goht it gibts scho');
        return;
      }

      this.parentForm.form.addControl(this.parentFormConnect, this.form.form);
      // this.removeControlFunction=()=> {
      //   console.log('parent unregister ' + this.parentFormConnect);
      //   this.parentForm.form.removeControl(this.parentFormConnect);
      // };
    }
  }

  ngOnDestroy(): void {

    this.removeControlFunction();

  }

   private removeControlFunction = () => {
    // console.log('parent unregister ' + this.parentFormConnect);
    this.parentForm.form.removeControl(this.parentFormConnect);
  }

}
