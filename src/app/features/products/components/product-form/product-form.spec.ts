import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { ProductForm } from './product-form';
import { ProductService } from '../../../../core/services/product.service';
import { CategoryService } from '../../../../core/services/category.service';
import { NotificationService } from '../../../../core/services/notification.service';

describe('ProductForm', () => {
  let component: ProductForm;
  let fixture: ComponentFixture<ProductForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductForm],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        {
          provide: ProductService,
          useValue: {
            getById: () => of({}),
            create: () => of({}),
            update: () => of({}),
          },
        },
        {
          provide: CategoryService,
          useValue: {
            findAll: () => of([]),
          },
        },
        {
          provide: NotificationService,
          useValue: {
            showSuccess: () => {},
            showError: () => {},
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
