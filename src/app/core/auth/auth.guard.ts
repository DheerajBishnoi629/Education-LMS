import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const authGuard: CanActivateFn = ( route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return toObservable(authService.isInitialized).pipe(
    filter((initialized) => initialized),
    take(1),
    map(() => {
      if (authService.currentUser()) {
        return true;
      }
      return router.createUrlTree(['/login']);
    })
  );
};
