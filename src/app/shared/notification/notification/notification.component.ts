import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../notification.service';

export interface Notify {
  action: string;
  msg: string;
}

@Component({
  selector: 'adif-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  notificationMsg: Notify;
  constructor(
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.notificationMsg = this.notificationService.getNotification();

    setTimeout(() => {
      this.resetNotification();
    }, 6000);
  }

  close() {
    this.resetNotification();
  }

  private resetNotification() {
    this.notificationMsg = null;
    this.notificationService.setNotification(null);
  }
}
