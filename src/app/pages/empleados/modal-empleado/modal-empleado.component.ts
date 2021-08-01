import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Detalle } from 'src/app/_model/detalle';
import { Empleado } from 'src/app/_model/empleado';
import { Pais } from 'src/app/_model/pais';
import { DetalleService } from 'src/app/_service/detalle.service';
import { EmpleadoService } from 'src/app/_service/empleado.service';
import { PaisService } from 'src/app/_service/pais.service';
import * as moment from 'moment';

@Component({
  selector: 'app-modal-empleado',
  templateUrl: './modal-empleado.component.html',
  styleUrls: ['./modal-empleado.component.css']
})
export class ModalEmpleadoComponent implements OnInit {

  paises$: Observable<Pais[]>;
  areas$: Observable<Detalle[]>;
  tiposidentificacion$: Observable<Detalle[]>;

  formEmpleado: FormGroup;

  constructor(
    private empleadoSercvice: EmpleadoService,
    private detalleService: DetalleService,
    private PaisService: PaisService,
    private dialogRef: MatDialogRef<ModalEmpleadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {

    this.listarAreas();
    this.listarPaises();
    this.listarTiposIdentificacion();
    this.initFormEpleado();
    this.cargarDatosEdicion();
  }

  initFormEpleado() {
    this.formEmpleado = new FormGroup({
      id: new FormControl(0, [Validators.required]),
      primerApellido: new FormControl("", [Validators.required, Validators.maxLength(20), Validators.pattern('^[A-Z ]+$'), Validators.nullValidator]),
      segundoApellido: new FormControl("", [Validators.maxLength(20), Validators.pattern('^[A-Z ]+$'), Validators.nullValidator]),
      primerNombre: new FormControl("", [Validators.required,Validators.maxLength(20), Validators.pattern('^[A-Z ]+$'), Validators.nullValidator]),
      otroNombre: new FormControl("", [Validators.maxLength(50), Validators.pattern('^[A-Z ]+$'), Validators.nullValidator]),
      tipoIdentificacion: new FormControl("", [Validators.required]),
      numeroIdentificacion: new FormControl("", [Validators.required,Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9-]+$'), Validators.nullValidator]),
      fechaIngreso: new FormControl(new Date()),
      area: new FormControl(0, [Validators.required]),
      pais: new FormControl(0, [Validators.required]),
    });
  }

  private listarAreas() {
    this.areas$ = this.detalleService.findAllArea();
  }

  private listarTiposIdentificacion() {
    this.tiposidentificacion$ = this.detalleService.findAllTipoDocumento();
  }

  private listarPaises() {
    this.paises$ = this.PaisService.findAll();
  }

  operar() {
    let tipoIdentificacion: Detalle = new Detalle();
    tipoIdentificacion.id = this.formEmpleado.controls['tipoIdentificacion'].value;

    let area: Detalle = new Detalle();
    area.id = this.formEmpleado.controls['area'].value;

    let pais: Pais = new Pais();
    pais.id = this.formEmpleado.controls['pais'].value;

    let empleado = new Empleado();
    empleado.primerApellido = this.formEmpleado.value['primerApellido'];
    empleado.segundoApellido = this.formEmpleado.value['segundoApellido'];
    empleado.primerNombre = this.formEmpleado.value['primerNombre'];
    empleado.otroNombre = this.formEmpleado.value['otroNombre'];
    empleado.pais = pais
    empleado.tipoIdentificacion = tipoIdentificacion;
    empleado.numeroIdentificacion = this.formEmpleado.value['numeroIdentificacion'];
    empleado.fechaIngreso = moment(this.formEmpleado.value['fechaIngreso']).format('DD/MM/YYYY');
    empleado.area = area;

    if (this.data.id != 0) {

      empleado.id = this.data.id;
      console.log(empleado);
      this.empleadoSercvice.modify(empleado).pipe(switchMap(() => {
        return this.empleadoSercvice.finAll();
      })).subscribe(res => {
        this.empleadoSercvice.setEmpleadoCambio(res);
        this.empleadoSercvice.setMensajeCambio("SE MODIFICO");
        this.dialogRef.close(true);
      });

    } else {
      this.empleadoSercvice.save(empleado).pipe(switchMap(() => {
        return this.empleadoSercvice.finAll();
      })).subscribe(data => {
        this.empleadoSercvice.setEmpleadoCambio(data);
        this.dialogRef.close(true);
        this.empleadoSercvice.setMensajeCambio("SE REGISTRO");
      });
    }
  }

  private cargarDatosEdicion() {
    if (this.data.id != 0) {
      this.empleadoSercvice.findById(this.data.id).subscribe(res => {

        this.formEmpleado.setValue({
          id: res.id,
          primerApellido: res.primerApellido,
          segundoApellido: res.segundoApellido,
          primerNombre: res.primerNombre,
          otroNombre: res.otroNombre,
          tipoIdentificacion: res.tipoIdentificacion.id,
          numeroIdentificacion: res.numeroIdentificacion,
          fechaIngreso: res.fechaIngreso,
          area: res.area.id,
          pais: res.pais.id,
        });
        console.log(new Date);
      });
    }
  }
}
