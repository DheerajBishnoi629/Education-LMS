import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRoles = route.data['expectedRoles'] as string[];

  return toObservable(authService.isInitialized).pipe(
    filter((initialized) => initialized),
    take(1),
    map(() => {
      const user = authService.currentUser();
      if (user && expectedRoles.includes(user.role)) {
        return true;
      }
      return router.createUrlTree(['/unauthorized']);
    })
  );
};
