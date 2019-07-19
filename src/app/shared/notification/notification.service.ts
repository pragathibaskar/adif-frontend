import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Notify } from './notification/notification.component';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notification: Notify;
  constructor() { }

  setNotification(msg: Notify) {
    this.notification = msg;
  }

  getNotification(): Notify {
    return this.notification;
  }
}
