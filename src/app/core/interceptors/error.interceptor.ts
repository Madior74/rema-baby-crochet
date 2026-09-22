import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { NotificationService } from "../services/notification.service";
import { AuthService } from "../services/auth/auth.service";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);


  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
  
      const message = error.error?.message ?? 'Une erreur réseau est survenue';
      notifications.showError(message);
      return throwError(() => error);
    }),
  );

  
};
