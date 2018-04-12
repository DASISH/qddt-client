import { Component, NgModule, OnInit, DoCheck, Input, ViewChild, AfterContentChecked} from '@angular/core';
import { BrowserModule} from '@angular/platform-browser';
import { QddtModalService } from './dialogbox.service';

@Component({
  selector: 'qddt-modal',
  template: `
<div class="modal modal-fixed-footer" id="modalId"
    materialize="modal" [materializeActions]="modalCompShow"
    (click)="clickOverlay($event)" [hidden]="!show">

  <div class="modal-content" #modalContent>
    <ng-content></ng-content>
  </div>

  <div class="modal-footer">
    <a class="modal-action modal-close waves-effect waves-purple btn-flat teal white-text">Close</a>
    <button class="close-button" (click)="toggle()"><span>&times;</span></button>
  </div>

</div>
`,
  styles: [
/*     '.reveal-overlay { background: rgba(0,0,0,0.6); position: fixed; top: 0; left: 0; right: 0; bottom: 0; }',
    '.reveal { background: white; width: 90%; margin: 40px auto; min-height: 70vh; position: relative; padding: 20px; }',
    '.close-button { position: absolute; right: 10px; top: 10px; }'
 */    ]
})
export class QddtModalComponent implements OnInit, DoCheck, AfterContentChecked {
  @Input() name: string;
  @ViewChild('modalContent') modalContent;

  public modalId = Math.random();
  private show = false;
  // store elements to notify
  private notify: HTMLElement[] = [];

  constructor(private myModals: QddtModalService) { }

  ngOnInit() {
    this.myModals.set(this.name, this);
  }

  ngDoCheck(): void {
    throw new Error('Method not implemented.');
  }

  clickOverlay(event: Event) {
    const target = (event.target as HTMLElement);

    if (target.classList.contains('modal-fixed-footer')) {
      this.toggle();
    }
  }

  toggle() {
    this.show = !this.show;

    if (this.show) {
      document.addEventListener('keyup', this.escapeListener);
    } else {
      document.removeEventListener('keyup', this.escapeListener);
    }

    this.notify = [].slice.call(this.modalContent.nativeElement.children);
  }

  ngAfterContentChecked() {
    if (this.notify.length === 0) {
      return;
    }

    const event = this.createEvent(this.show ? 'modalOpen' : 'modalClose');
    let toNotify;

    while (toNotify = this.notify.shift()) {
      toNotify.dispatchEvent(event);
    }
  }

  private createEvent(name) {
    const event = document.createEvent('Events');
    event.initEvent(name, true, true);
    return event;
  }


  private escapeListener = (event: KeyboardEvent) => {
    if (event.which === 27 || event.keyCode === 27) {
      this.show = false;
    }
  }
}
