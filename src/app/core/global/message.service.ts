import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { IDetailAction, IElement, IIdRef, IRevisionRef } from '../../shared/classes/interfaces';


@Injectable()
export class QddtMessageService {
    private subject = new Subject<IIdRef|IRevisionRef|IElement>();

    private action = new Subject<IDetailAction>();

    sendAction(action: IDetailAction) {
      this.action.next(action);
    }

    getAction(): Observable<IDetailAction> {
      return this.action.asObservable();
    }

    sendMessage(ref: IIdRef|IRevisionRef|IElement) {
        this.subject.next(ref);
    }

    clearMessage() {
        this.subject.next();
    }

    getMessage(): Observable<IIdRef|IRevisionRef|IElement> {
        return this.subject.asObservable();
    }
}
