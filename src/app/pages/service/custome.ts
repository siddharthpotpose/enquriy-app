import { Injectable, signal } from '@angular/core';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface Alert {
  message: string;
  type: AlertType;
  visible: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class Custome {

  
  alert = signal<Alert>({
    message: '',
    type: 'info',
    visible: false
  });

  show(message: string, type: AlertType = 'info') {
    this.alert.set({
      message,
      type,
      visible: true
    });

    // auto close after 3 seconds
    setTimeout(() => this.hide(), 3000);
  }

  hide() {
    this.alert.update(a => ({ ...a, visible: false }));
  }

  success(msg: string) {
    this.show(msg, 'success');
  }

  error(msg: string) {
    this.show(msg, 'error');
  }

  warning(msg: string) {
    this.show(msg, 'warning');
  }

  info(msg: string) {
    this.show(msg, 'info');
  }
  
}
