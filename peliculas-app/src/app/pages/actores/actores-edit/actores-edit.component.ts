import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActorDTO } from '../../../models/actor.model';
import { firstLetterToUpper } from '../../../utilidades';
import { ActoresService } from '../../../services/actores.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-actores-edit',
  templateUrl: './actores-edit.component.html',
  styleUrls: ['./actores-edit.component.css'],
})
export class ActoresEditComponent implements OnInit {
  editMode = false;
  form: FormGroup;
  actor: ActorDTO;
  currentId: number;

  // Getters
  get nombre(): any {
    return this.form.get('nombre');
  }

  get apellido(): any {
    return this.form.get('apellido');
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private actorSvc: ActoresService,
    private spinner: NgxSpinnerService
  ) {
    this.form = this.fb.group({
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-ZA-ZÀ-ÿ.\u00f1\u00d1 ´]*$'),
      ]),
      apellido: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('^[a-zA-ZA-ZÀ-ÿ.\u00f1\u00d1 ´]*$'),
      ]),
      fechaNacimiento: null,
      foto: '',
      biografia: '',
    });
  }

  ngOnInit(): void {
    this.spinner.show();
    this.route.params.subscribe((params: any) => {
      if (params['id']) {
        this.editMode = true;
        this.currentId = params['id'];
      }

      if (this.editMode) {
        this.spinner.show();

        this.actorSvc.obtenerActorPorId(this.currentId).subscribe(
          (actor) => {
            this.actor = actor;

            const dataToForm = {
              ...this.actor,
              fechaNacimiento: new Date(this.actor.fechaNacimiento),
            };

            this.form.patchValue(dataToForm);
            this.spinner.hide();
          },
          (err) => {
            console.log(err);
            this.router.navigateByUrl('/actores');
          }
        );
      } else {
        this.spinner.hide();
      }
    });
  }

  recibirImagen(file: File) {
    this.form.get('foto').setValue(file);
  }

  cambioBio(bio: string) {
    this.form.get('biografia').setValue(bio);
  }

  // Coloca la primera letra del campo en mayuscula.
  setFirstLetterToUpper() {
    if (this.nombre.value.length > 0) {
      this.nombre.setValue(firstLetterToUpper(this.nombre.value));
    }

    if (this.apellido.value.length > 0) {
      this.apellido.setValue(firstLetterToUpper(this.apellido.value));
    }
  }

  // Devuelve los errores del campo Nombre en mat-error
  mostrarErroresNombre() {
    if (this.nombre) {
      if (this.nombre.hasError('required')) {
        return 'El campo Nombre es requerido.';
      }

      if (this.nombre.hasError('minlength')) {
        return `El campo debe tener por lo menos ${this.nombre.errors.minlength?.requiredLength} caracteres.`;
      }

      if (this.nombre.hasError('pattern')) {
        return 'El campo Nombre solo debe tener letras.';
      }
    }

    return '';
  }

  // Devuelve los errores del campo Apellido en mat-error
  mostrarErroresApellido() {
    if (this.apellido) {
      if (this.apellido.hasError('required')) {
        return 'El campo Apellido es requerido.';
      }

      if (this.apellido.hasError('minlength')) {
        return `El campo debe tener por lo menos ${this.apellido.errors.minlength?.requiredLength} caracteres.`;
      }

      if (this.apellido.hasError('pattern')) {
        return 'El campo Apellido solo debe tener letras.';
      }
    }
    return '';
  }

  guardarCambios() {
    this.spinner.show();

    const {
      nombre,
      apellido,
      fechaNacimiento,
      foto,
      biografia,
    } = this.form.value;

    this.actor = {
      nombre,
      apellido,
      foto,
      fechaNacimiento: new Date(fechaNacimiento),
      biografia,
    };

    if (this.editMode) {
      // ...Actualizar actor
      this.actorSvc.actualizarActor(this.currentId, this.actor).subscribe(
        (resp: ActorDTO) => {
          this.spinner.hide();
          console.log(resp);
          const { nombre, apellido } = resp;

          Swal.fire({
            icon: 'success',
            title: 'Actor Actualizado!',
            text: `El actor ${nombre} ${apellido} ha sido actualizado exitosamente.`,
          }).then(() => this.router.navigateByUrl('/actores'));
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();

          Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error',
            text: `${err.message}`,
          }).then(() => this.router.navigateByUrl('/actores'));
        }
      );
    } else {
      // ...Crear nuevo actor
      this.actorSvc.crearActor(this.actor).subscribe(
        (resp: any) => {
          this.spinner.hide();
          console.log(resp);
          const { nombre, apellido } = resp;

          Swal.fire({
            icon: 'success',
            title: 'Nuevo actor creado!',
            text: `${nombre} ${apellido} ha sido agregado exitosamente.`,
          }).then(() => this.router.navigateByUrl('/actores'));
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();

          Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error',
            text: `${err.message}`,
          }).then(() => this.router.navigateByUrl('/actores'));
        }
      );
    }
  }
}
