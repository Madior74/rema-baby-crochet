import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { tap } from "rxjs";
import { LoginResponse } from "./auth.response.model";


const TOKEN_KEY='rema-auth-token';
const CLIENT_KEY='rema-auth-client';


export interface AuthUser{
    email:string;
    roles:string[];
}


@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  //Signal
  private readonly currentUser = signal<AuthUser | null>(this.loadUser());
  readonly user = this.currentUser.asReadonly();
  readonly isLoggedIn = computed(() => !!this.currentUser());
  readonly isAdmin = computed(() => this.currentUser()?.roles.includes('ROLE_ADMIN') ?? false);

  login(email: string, password: string) {
    return this.http
      .post<LoginResponse>(
        `${environment.authUrl}/login`, 
        { email, password },
      )
      .pipe(
        tap((res) => {
          localStorage.setItem(TOKEN_KEY, res.token);
          const user: AuthUser = {
            email: res.email,
            roles: res.roles,
          };
          localStorage.setItem(CLIENT_KEY, JSON.stringify(user));
          this.currentUser.set(user);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CLIENT_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/hero']);
  }
  
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private loadUser(): AuthUser | null {
    const raw = localStorage.getItem(CLIENT_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      localStorage.removeItem(CLIENT_KEY);
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
  }
}