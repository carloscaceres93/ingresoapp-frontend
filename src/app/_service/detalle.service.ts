import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Detalle } from '../_model/detalle';

@Injectable({
  providedIn: 'root'
})
export class DetalleService {

  private detalleCambio = new Subject<Detalle[]>();
  private mensajeCambio: Subject<string> = new Subject<string>();

  private path: string = `${environment.HOST}/detalle`;


  constructor(
    private http: HttpClient,
  ) { }

  findAllArea(){
    return this.http.get<Detalle[]>(`${this.path}/areas`);
  }

  findAllTipoDocumento(){
    return this.http.get<Detalle[]>(`${this.path}/tipos-identificacion`);
  }

  getDetalleCambio() {
    return this.detalleCambio.asObservable();
  }

  setDetalleCambio(lista: Detalle[]) {
    this.detalleCambio.next(lista);
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }
}
