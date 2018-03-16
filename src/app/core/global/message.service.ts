import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { IElementRef, IRevisionRef } from '../../preview/preview.service';

@Injectable()
export class QddtMessageService {
    private subject = new Subject<IRevisionRef|IElementRef>();

    sendMessage(ref: IRevisionRef|IElementRef) {
        this.subject.next(ref);
    }

    clearMessage() {
        this.subject.next();
    }

    getMessage(): Observable<IRevisionRef|IElementRef> {
        return this.subject.asObservable();
    }
}
