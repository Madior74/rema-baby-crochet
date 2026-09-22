import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./shared/header/header";
import { NotificationService } from './core/services/notification.service';
import { CommonModule } from '@angular/common';
import { Footer } from './shared/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, CommonModule,Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('rema-baby-crochet');
  protected readonly notifications = inject(NotificationService);
}
