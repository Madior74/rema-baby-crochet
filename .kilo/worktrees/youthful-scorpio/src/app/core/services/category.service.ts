import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { CategoryCreateRequest } from "../../features/categories/dto/categoryCreateRequest";
import { Observable } from "rxjs";
import { Category } from "../../features/categories/models/Category.model";
import { CategoryResponse } from "../../features/categories/dto/categoryResponse";


@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/categories`;

  //create
  create(payload: CategoryCreateRequest): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, payload);
  }

  //find All
  findAll(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(this.baseUrl);
  }




  //get by id
  getById(id: number): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.baseUrl}/${id}`);
  }

  //update
  update(id: number, payload: CategoryCreateRequest): Observable<CategoryResponse> {
    return this.http.put<CategoryResponse>(`${this.baseUrl}/${id}`, payload);
  }

  //delete
  delete(id:number):Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}/${id}`)
  }
}