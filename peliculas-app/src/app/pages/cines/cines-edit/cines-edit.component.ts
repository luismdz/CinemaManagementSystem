import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CineDTO } from '../../../models/cine.model';
import { firstLetterToUpper } from '../../../utilidades';
import { CineService } from '../../../services/cine.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cines-edit',
  templateUrl: './cines-edit.component.html',
  styleUrls: ['./cines-edit.component.css'],
})
export class CinesEditComponent implements OnInit {
  editMode = false;
  form: FormGroup;
  cine: CineDTO;
  currentId: number;
  coordenadasIniciales = [];

  get nombre() {
    return this.form.get('nombre');
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cineSvc: CineService
  ) {
    this.form = this.fb.group({
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern('^[a-zA-Z0-9-.: ]*$'),
      ]),
      latitud: new FormControl(null, [Validators.required]),
      longitud: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      if (params['id']) {
        this.editMode = true;
        this.currentId = +params['id'];
      }

      if (this.editMode) {
        this.cineSvc.obtenerCinePorId(this.currentId).subscribe(
          (cine: CineDTO) => {
            this.cine = cine;
            this.cargarDatosFormulario(this.cine);
          },
          (err: HttpErrorResponse) => console.log(err)
        );
      }
    });
  }

  cargarDatosFormulario(cine: CineDTO): void {
    if (cine) {
      this.form.patchValue({
        nombre: cine.nombre,
        latitud: cine.coordenadas.latitud,
        longitud: cine.coordenadas.longitud,
      });

      const coordenadas = [];
      coordenadas.push(cine.coordenadas);

      this.coordenadasIniciales = coordenadas;
    }
  }

  recibirCoordenadas({ lat: latitud, lng: longitud }) {
    this.form.patchValue({ latitud, longitud });
  }

  mostrarErrores() {
    if (this.nombre) {
      if (this.nombre.hasError('required')) {
        return 'El campo Nombre es requerido.';
      }

      if (this.nombre.hasError('minlength')) {
        return `El campo debe tener por lo menos ${this.nombre.errors.minlength?.requiredLength} caracteres.`;
      }

      if (this.nombre.hasError('pattern')) {
        return 'El campo Nombre solo debe tener letras y números.';
      }
    }

    return '';
  }

  setFirstLetterToUpper() {
    if (this.nombre.value.length > 0) {
      this.nombre?.setValue(firstLetterToUpper(this.nombre.value));
    }
  }

  guardarCambios() {
    const { nombre, latitud, longitud } = this.form.value;

    this.cine = {
      nombre: nombre.trim(),
      coordenadas: {
        latitud,
        longitud,
      },
    };

    if (this.editMode) {
      this.cineSvc.actualizarCine(this.currentId, this.cine).subscribe(
        (resp) => {
          console.log(resp);
          this.router.navigateByUrl('/cines');
        },
        (err) => console.log(err)
      );
    } else {
      this.cineSvc.crearCine(this.cine).subscribe(
        (resp) => {
          console.log(resp);
          this.router.navigateByUrl('/cines');
        },
        (err) => console.log(err)
      );
    }
    // this.router.navigateByUrl('/cines');
  }
}
