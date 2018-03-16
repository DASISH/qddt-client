import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { IRevisionRef, IElementRef } from '../../preview/preview.service';


/**
 *
 * In memmory store...
 */
@Injectable()
export class QddtMessageService {

    private subject = new Subject<IRevisionRef|IElementRef>();

    sendMessage(message: IRevisionRef|IElementRef) {
        this.subject.next(message);
    }

    clearMessage() {
        this.subject.next();
    }

    getMessage(): Observable<IRevisionRef|IElementRef> {
        return this.subject.asObservable();
    }

}
