import { HttpInterceptorFn } from '@angular/common/http';
import { firebaseAuth } from '../firebase/firebase.config';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('http://localhost:3000')) {
    const user = firebaseAuth.currentUser;
    if (user) {
      return from(user.getIdToken()).pipe(
        switchMap((token) => {
          const authReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          return next(authReq);
        })
      );
    }
  }
  return next(req);
};
