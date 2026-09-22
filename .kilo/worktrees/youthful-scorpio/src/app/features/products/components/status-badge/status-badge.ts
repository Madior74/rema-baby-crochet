import { Component, computed, input } from '@angular/core';
import { ProductStatus } from '../../../../features/products/models/ProductStatus.model';

@Component({
  selector: 'app-status-badge',
  imports: [],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css',
})
export class StatusBadge   {
  readonly status = input.required<ProductStatus>();

  readonly label = computed(() => (this.status() === 'ACTIVE' ? 'Actif' : 'Inactif'));

  readonly badgeClasses = computed(() =>
    this.status() === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600',
  );

  readonly dotClasses = computed(() =>
    this.status() === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400',
  );
}
