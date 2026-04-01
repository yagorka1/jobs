import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const apiReq: HttpRequest<unknown> = req.clone({
    url: `${environment.apiUrl}${req.url}`,
  });
  return next(apiReq);
};
