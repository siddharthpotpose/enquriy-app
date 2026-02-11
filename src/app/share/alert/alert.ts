import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService, AlertConfig } from './alert.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
})
export class Alert {
  alertService = inject(AlertService);

  // Convert observables to signals for template use
  visible = toSignal(this.alertService.visible$, { initialValue: false });
  config = toSignal(this.alertService.config$, { initialValue: { message: '', type: 'info' as const } });

  get icon(): string {
    const type = this.config().type;
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return 'ℹ';
    }
  }

  hide() {
    this.alertService.hide();
  }
}
