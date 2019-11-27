import { Injectable } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';
import {IDetailAction, IElement, IElementRef, IRevisionRef} from '../interfaces';


@Injectable()
export class MessageService {
    private subject = new Subject<IElementRef|IRevisionRef|IElement>();

    private action = new Subject<IDetailAction>();

    sendAction(action: IDetailAction) {
      this.action.next(action);
    }

    getAction(): Observable<IDetailAction> {
      return this.action.asObservable();
    }

    sendMessage(ref: IElementRef|IRevisionRef|IElement) {
        this.subject.next(ref);
    }

    clearMessage() {
        this.subject.next();
    }

    getMessage(): Subject<IElementRef|IRevisionRef|IElement> {
        return this.subject;
    }
}
