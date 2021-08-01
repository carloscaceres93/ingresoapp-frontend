import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Empleado } from '../_model/empleado';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  private empleadoCambio = new Subject<Empleado[]>();
  private mensajeCambio: Subject<string> = new Subject<string>();

  private path: string = `${environment.HOST}/empleados`;
  constructor(
    private http: HttpClient
  ) { }

  finAll(){
    return this.http.get<Empleado[]>(this.path);
  }

  finAllPaginate(p:number, s: number){
    return this.http.get<any>(`${this.path}/pageable?page=${p}&size=${s}`);
  }

  findById(id: number) {
    return this.http.get<Empleado>(`${this.path}/${id}`);
  }

  save(empleado: Empleado) {
    return this.http.post(this.path, empleado);
  }

  modify(empleado: Empleado) {
    return this.http.put(this.path, empleado);
  }

  delete(id: number) {
    return this.http.delete(`${this.path}/${id}`);
  }


  getEmpleadoCambio() {
    return this.empleadoCambio.asObservable();
  }

  setEmpleadoCambio(lista: Empleado[]) {
    this.empleadoCambio.next(lista);
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }
}
