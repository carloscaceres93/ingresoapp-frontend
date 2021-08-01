import { Router } from '@angular/router';
import { environment } from './../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { tap, catchError, retry } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ServerErrorsInterceptor implements HttpInterceptor {

    constructor(private snackBar: MatSnackBar, private router : Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(retry(environment.REINTENTOS))
            .pipe(tap(event => {
                if (event instanceof HttpResponse) {
                    if (event.body && event.body.error === true && event.body.errorMessage) {
                        throw new Error(event.body.errorMessage);
                    }
                }

            })).pipe(catchError((err) => {

                if (err.status === 400) {
                    console.log(err);
                    this.snackBar.open(err.error.mensaje, 'ERROR 400', { duration: 5000 });
                }
                else if (err.status === 404){
                    this.snackBar.open(err.error.mensaje, 'ERROR 404', { duration: 5000 });
                }
                else if (err.status === 500) {
                    this.snackBar.open(err.error.mensaje, 'ERROR 500', { duration: 5000 });
                } else {
                    this.snackBar.open(err.error.mensaje, 'ERROR', { duration: 5000 });
                }
                return EMPTY;
            }));
    }
}
