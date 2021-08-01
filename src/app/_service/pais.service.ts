import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pais } from '../_model/pais';

@Injectable({
  providedIn: 'root'
})
export class PaisService {

  private paisCambio = new Subject<Pais[]>();
  private mensajeCambio: Subject<string> = new Subject<string>();

  private path: string = `${environment.HOST}/paises`;

  constructor(
    private http: HttpClient
  ) { }

  findAll(){
    return this.http.get<Pais[]>(this.path);
  }

  getPaisCambio() {
    return this.paisCambio.asObservable();
  }

  setPaisCambio(lista: Pais[]) {
    this.paisCambio.next(lista);
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }
}
