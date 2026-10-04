import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NotificationService } from '../../core/services/notification.service';

interface ContactForm {
  name: string;
  phone: string;
  subject: string;
  message: string;
}

const WHATSAPP_NUMBER = '221773908881';
const CONTACT_EMAIL = 'contact@remababycrochet.com';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-contact',
  styleUrl: './contact.css',
  templateUrl: './contact.html',
})
export class Contact {
  private readonly toast = inject(NotificationService);

  readonly subjects = [
    'Question sur un produit',
    'Suivi de commande',
    'Pièce sur mesure',
    'Autre demande',
  ];

  form: ContactForm = {
    name: '',
    phone: '',
    subject: this.subjects[0],
    message: '',
  };

  constructor() {
    inject(Title).setTitle('Contact | Réma Baby Crochet');
  }

  sendWhatsApp(): void {
    if (!this.isValid()) return;
    const lines = [
      'Bonjour Réma Baby Crochet,',
      `Sujet : ${this.form.subject}`,
      `Nom : ${this.form.name.trim()}`,
    ];
    if (this.form.phone.trim()) {
      lines.push(`Téléphone : ${this.form.phone.trim()}`);
    }
    lines.push('', this.form.message.trim());

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener');
  }

  sendEmail(): void {
    if (!this.isValid()) return;
    const body = [
      this.form.message.trim(),
      '',
      `Nom : ${this.form.name.trim()}`,
      this.form.phone.trim() ? `Téléphone : ${this.form.phone.trim()}` : '',
    ]
      .filter((line, i, all) => line !== '' || i === 1 || all[i - 1] !== '')
      .join('\n');

    window.location.href =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent(this.form.subject)}` +
      `&body=${encodeURIComponent(body)}`;
  }

  private isValid(): boolean {
    if (!this.form.name.trim()) {
      this.toast.showError('Indiquez votre nom.');
      return false;
    }
    if (!this.form.message.trim()) {
      this.toast.showError('Écrivez votre message.');
      return false;
    }
    return true;
  }
}
