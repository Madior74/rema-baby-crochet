import { Component, DestroyRef, inject, input, OnInit, output } from '@angular/core';
import { Category } from '../../../categories/models/Category.model';
import { ProductFilterValues } from '../../models/ProductFilterValues.model';
import { AGE_RANGES, MATERIALS } from '../../models/Product.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-product-filter',
  styleUrl: './product-filter.css',
  templateUrl: './product-filter.html',
})
export class ProductFilter implements OnInit {
  readonly categories = input.required<Category[]>();
  readonly filtersChange = output<ProductFilterValues>();
  private readonly destroyRef=inject(DestroyRef); 
  readonly ageRanges = AGE_RANGES;
  readonly materials = MATERIALS;

  readonly categoryControl = new FormControl<number | null>(null);
  readonly ageRangeControl = new FormControl<string | null>(null);
  readonly materialControl = new FormControl<string | null>(null);

  ngOnInit(): void {
    this.categoryControl.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.emitFilters());

    this.ageRangeControl.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.emitFilters());

    this.materialControl.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.emitFilters());

    this.emitFilters();
  }

  resetFilters(): void {
    this.categoryControl.setValue(null);
    this.ageRangeControl.setValue(null);
    this.materialControl.setValue(null);
  }

  private emitFilters(): void {
    this.filtersChange.emit({
      categoryId: this.categoryControl.value,
      ageRange: this.ageRangeControl.value,
      material: this.materialControl.value,
    });

      console.log('[ProductFilter] emitFilters', this.filtersChange);
  }
}
