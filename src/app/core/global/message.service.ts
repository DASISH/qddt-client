import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { IRevisionRef, IElementRef, IIdRef } from '../../shared/elementinterfaces/elements';
import { IDetailAction} from '../../shared/elementinterfaces/detailaction';


@Injectable()
export class QddtMessageService {
    private subject = new Subject<IIdRef|IRevisionRef|IElementRef>();

    private action = new Subject<IDetailAction>();

    sendAction(action: IDetailAction) {
      this.action.next(action);
    }

    getAction(): Observable<IDetailAction> {
      return this.action.asObservable();
    }

    sendMessage(ref: IIdRef|IRevisionRef|IElementRef) {
        this.subject.next(ref);
    }

    clearMessage() {
        this.subject.next();
    }

    getMessage(): Observable<IIdRef|IRevisionRef|IElementRef> {
        return this.subject.asObservable();
    }
}
