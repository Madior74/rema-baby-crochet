import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../../features/products/models/Product.model';
import { Page, ProductCreateRequest, ProductUpdateRequest } from '../../features/products/dto/ProductCreateRequest.dto';
import { ProductSearchParams } from '../../features/products/dto/ProductSearchParams';


@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/products`;

  search(params: ProductSearchParams): Observable<Page<Product>> {
    let httpParams = new HttpParams().set('page', params.page ?? 0).set('size', params.size ?? 12);

    if (params.name) httpParams = httpParams.set('name', params.name);
    if (params.categoryId) httpParams = httpParams.set('categoryId', params.categoryId);
    if (params.material) httpParams = httpParams.set('material', params.material);
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.ageRange) httpParams = httpParams.set('ageRange', params.ageRange);

    // Log the final query string to help debug missing/incorrect filters
    console.log('[ProductService] GET', this.baseUrl + '?' + httpParams.toString());
    return this.http.get<Page<Product>>(this.baseUrl, { params: httpParams });
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  create(payload: ProductCreateRequest): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, payload);
  }

  update(id: string, payload: ProductUpdateRequest): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
