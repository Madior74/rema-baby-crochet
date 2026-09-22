import { Injectable, signal } from "@angular/core";

export interface Notification {
  id: number;
  message: string;
  type: 'error' | 'success';
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private nextId = 0;
  readonly notifications = signal<Notification[]>([]);

  showError(message: string): void {
    this.push(message, 'error');
  }

  showSuccess(message: string): void {
    this.push(message, 'success');
  }

  dismiss(id: number): void {
    this.notifications.update((list) => list.filter((n) => n.id !== id));
  }

  private push(message: string, type: Notification['type']): void {
    const id = this.nextId++;
    this.notifications.update((list) => [...list, { id, message, type }]);
    setTimeout(() => this.dismiss(id), 4000);
  }
}
