import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NotificationService } from '../../core/services/notification.service';
import { AGE_RANGES, MATERIALS, prettyMaterial } from '../products/models/Product.model';
import { SurMesureForm } from './model/Sur-mesure-form';



@Component({
  imports: [FormsModule],
  selector: 'app-sur-mesure',
  styleUrl: './sur-mesure.css',
  templateUrl: './sur-mesure.html',
})
export class SurMesure {
  private toast = inject(NotificationService);

  ageRanges = AGE_RANGES;
  materials = MATERIALS;

  form: SurMesureForm = {
    childAge: AGE_RANGES[0],
    material: MATERIALS[1],
    preferences: '',
    name: '',
    phone: '',
    message: '',
  };

  sent = signal(false);

  constructor() {
    inject(Title).setTitle('Sur-Mesure — Réma Baby Crochet');
  }

  protected prettyMaterial = prettyMaterial;

  submit(): void {
    // Validation simple
    if (!this.form.childAge) {
      this.toast.showError('La tranche d’âge est obligatoire.');
      return;
    }
    if (!this.form.material) {
      this.toast.showError('La matière est obligatoire.');
      return;
    }
    if (!this.form.name || this.form.name.trim() === '') {
      this.toast.showError('Le nom est obligatoire.');
      return;
    }
    // if (!this.form.phone || this.form.phone.trim() === '') {
    //   this.toast.showError('Le téléphone est obligatoire.');
    //   return;
    // }

    const lines = [
      'Bonjour Réma Baby Crochet ♥ Je souhaite commander une pièce sur mesure :',
      `• Tranche d'âge : ${this.form.childAge}`,
      `• Matière : ${prettyMaterial(this.form.material)}`,
      `• Préférences : ${this.form.preferences || 'selon vos idées'}`,
      `• Nom : ${this.form.name.trim()}`,
      `• Téléphone : ${this.form.phone.trim()}`,
    ];
    if (this.form.message && this.form.message.trim() !== '') {
      lines.push(`• Message : ${this.form.message.trim()}`);
    }

    window.open(whatsappLink(lines.join('\n')), '_blank', 'noopener');
    this.sent.set(true);
    this.toast.showSuccess("Merci ! Votre demande s'ouvre dans WhatsApp ♥");
  }
}
function whatsappLink(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/773908881?text=${encoded}`;
}
