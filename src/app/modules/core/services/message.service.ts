import { Injectable } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';
import { IDetailAction, IElement, IIdRef, IRevisionRef} from '../../../classes';


@Injectable()
export class MessageService {
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
