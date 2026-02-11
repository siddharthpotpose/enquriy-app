import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AlertConfig {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private configSubject = new BehaviorSubject<AlertConfig>({ message: '', type: 'info' });
  private visibleSubject = new BehaviorSubject<boolean>(false);

  config$ = this.configSubject.asObservable();
  visible$ = this.visibleSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
    this.configSubject.next({ message, type });
    this.visibleSubject.next(true);
    
    // Auto close after 5 seconds
    setTimeout(() => {
      this.visibleSubject.next(false);
    }, 2000);
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  warning(message: string) {
    this.show(message, 'warning');
  }

  info(message: string) {
    this.show(message, 'info');
  }

  hide() {
    this.visibleSubject.next(false);
  }

  getConfig(): AlertConfig {
    return this.configSubject.value;
  }

  isVisible(): boolean {
    return this.visibleSubject.value;
  }
}
