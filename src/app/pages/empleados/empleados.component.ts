import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Empleado } from 'src/app/_model/empleado';
import { EmpleadoService } from 'src/app/_service/empleado.service';
import { switchMap } from 'rxjs/operators';
import { ModalConfirmarComponent } from '../generic/modal-confirmar/modal-confirmar.component';
import { ModalEmpleadoComponent } from './modal-empleado/modal-empleado.component';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<Empleado>;
  displayedColumns: string[] =['identificacion','nombres', 'apellidos','pais','email', 'fechaIngreso', 'fechaRegistro','fechaEdicion', 'acciones'];
  cantidad: number = 0;

  constructor(
    private empleadoService: EmpleadoService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.listarEmpleadosPaginados();
    this.getEmpleadoCambio();
    this.getMensajeCambio();
  }

  private listarEmpleadosPaginados(empleado?: any){
    this.empleadoService.finAllPaginate(0,10).subscribe(data =>{
      empleado = data;
      this.cantidad = empleado.totalElements;
      this.dataSource = new MatTableDataSource(empleado.content);
      this.dataSource.sort = this.sort;
    });
  }

  private getEmpleadoCambio() {
    this.empleadoService.getEmpleadoCambio().subscribe((data) => {
      this.listarEmpleadosPaginados(data);
    });
  }

  private getMensajeCambio() {
    this.empleadoService.getMensajeCambio().subscribe((data) => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
      });
    });
  }

  mostrarMas(e: any){
    this.empleadoService.finAllPaginate(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }

  eliminar(id: number){
    let dialogRef = this.dialog.open(ModalConfirmarComponent,{
      disableClose: true,
      height : "180px",
      width: "300px",
    });
    dialogRef.afterClosed().subscribe(res =>{
      if(res){
        this.empleadoService.delete(id).pipe(switchMap(()=>{
          return this.empleadoService.finAll();
        }))
        .subscribe(data =>{
          this.empleadoService.setEmpleadoCambio(data);
          this.empleadoService.setMensajeCambio('SE A ELMININADO CORRECTAMENTE');

        })
      }
    })
  }

  openDialog(id?: number) {
    this.dialog.open(ModalEmpleadoComponent, {
      disableClose: true,
      height: '550px',
      width: '700px',
      data: {
        id: id
      },
    })
  }

}
