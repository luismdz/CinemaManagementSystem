import { Component, OnInit } from '@angular/core';
import { firstLetterToUpper } from '../../../utilidades';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PeliculaCreacionDTO,
  PeliculaDTO,
} from '../../../models/pelicula.model';
import { GeneroDTO } from '../../../models/generos.model';
import { PeliculasService } from '../../../services/peliculas.service';
import { GenerosService } from '../../../services/generos.service';
import { Selector } from '../../../models/selector.model';
import { CineService } from '../../../services/cine.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CineDTO } from 'src/app/models/cine.model';
import { ActorDTO } from '../../../models/actor.model';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-peliculas-edit',
  templateUrl: './peliculas-edit.component.html',
  styleUrls: ['./peliculas-edit.component.css'],
})
export class PeliculasEditComponent implements OnInit {
  form: FormGroup;
  editMode = false;
  currentId: number;
  pelicula: PeliculaCreacionDTO | PeliculaDTO;
  generos: GeneroDTO[] = [];
  cines: CineDTO[];
  generosSelector: Selector[];
  cinesSelector: Selector[];
  generosPeliculaEditar: any[];
  cinesPeliculaEditar: any[];
  actoresPeliculaEditar: any[];

  // Getters
  get titulo() {
    return this.form.get('titulo');
  }

  get resumen() {
    return this.form.get('resumen');
  }
  // Getters

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private peliculaSvc: PeliculasService,
    private generosSvc: GenerosService,
    private cineSvc: CineService
  ) {}

  ngOnInit(): void {
    // Creando el formulario
    this.form = this.fb.group({
      titulo: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern('^[a-zA-Z1-9.\\-: ]*$'),
      ]),
      resumen: '',
      enCines: false,
      trailer: '',
      fechaLanzamiento: null,
      poster: null,
      generosIds: '',
      cinesIds: '',
      actores: '',
    });
    // Creando el formulario

    this.generosSvc.obtenerTodos().subscribe((resp: any) => {
      this.generos = resp;

      this.generosSelector = this.generos.map((g) => {
        return <Selector>{
          id: g.id,
          nombre: g.nombre,
        };
      });
    });

    this.cineSvc.obtenerTodos().subscribe((resp: any) => {
      this.cines = resp;

      this.cinesSelector = this.cines.map((c) => {
        return <Selector>{
          id: c.id,
          nombre: c.nombre,
        };
      });
    });

    this.route.params.subscribe((params: any) => {
      if (params['id']) {
        this.editMode = true;
        this.currentId = +params['id'];
      }

      if (this.editMode) {
        this.peliculaSvc
          .obtenerPeliculaPorId(this.currentId)
          .subscribe((respuesta: PeliculaDTO) => {
            this.pelicula = respuesta;

            const dataToForm = {
              titulo: this.pelicula.titulo,
              resumen: this.pelicula.resumen,
              enCines: this.pelicula.enCines,
              trailer: this.pelicula.trailer,
              fechaLanzamiento: this.pelicula.fechaLanzamiento,
              poster: this.pelicula.poster,
              generosIds: this.pelicula.generos.map((x) => x.id),
              cinesIds: this.pelicula.cines.map((x) => x.id),
              actores: this.pelicula.actores,
            };

            this.form.patchValue(dataToForm);
            const { cinesIds, generosIds, actores } = this.form.value;

            this.generosPeliculaEditar = generosIds;
            this.cinesPeliculaEditar = cinesIds;
            this.actoresPeliculaEditar = actores;
          });
      }
    });
  }

  mostrarErrorTitulo(): string {
    if (this.titulo) {
      if (this.titulo.hasError('required')) {
        return 'El campo titulo es requerido.';
      }

      if (this.titulo.hasError('minlength')) {
        return `El campo debe tener por lo menos ${this.titulo.errors.minlength?.requiredLength} caracteres.`;
      }

      if (this.titulo.hasError('pattern')) {
        return 'El campo titulo solo debe tener letras.';
      }
    }
    return '';
  }

  setFirstLetterToUpper() {
    if (this.titulo.value.length > 0) {
      this.titulo?.setValue(firstLetterToUpper(this.titulo.value));
    }
  }

  recibirImagen(poster: File) {
    this.form.get('poster').setValue(poster);
  }

  recibirResumen(resumen: string) {
    this.form.get('resumen').setValue(resumen);
  }

  recibirGenerosSeleccionados(items: any) {
    this.form.get('generosIds').setValue(items);
  }

  recibirCinesSeleccionados(items: any) {
    this.form.get('cinesIds').setValue(items);
  }

  recibirActores(actores: ActorDTO[]) {
    const actoresPelicula = actores.map(({ id, personaje }) => ({
      id,
      personaje,
    }));

    this.form.get('actores').setValue(actoresPelicula);
  }

  guardarCambios() {
    const nuevaPelicula = <PeliculaCreacionDTO>this.form.value;

    this.pelicula = {
      ...nuevaPelicula,
    };

    if (this.editMode) {
      // ...update
      this.peliculaSvc
        .actualizarPelicula(this.currentId, nuevaPelicula)
        .subscribe(
          (resp: PeliculaDTO) => {
            Swal.fire({
              icon: 'success',
              title: 'Pelicula Actualizada!',
              text: `${resp.titulo} ha sido actualizada exitosamente.`,
            }).then(() => this.router.navigateByUrl(`/peliculas/${resp.id}`));
          },
          (err: HttpErrorResponse) => {
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error',
              text: `${err.message}`,
            }).then(() => this.router.navigateByUrl('/'));
          }
        );
    } else {
      // ...create
      this.peliculaSvc
        .crearPelicula(<PeliculaCreacionDTO>this.pelicula)
        .subscribe(
          (resp: PeliculaDTO) => {
            Swal.fire({
              icon: 'success',
              title: 'Nueva Pelicula Creada!',
              text: `${resp.titulo} ha sido agregada exitosamente.`,
            }).then(() => this.router.navigateByUrl('/'));
          },
          (err: HttpErrorResponse) => {
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error',
              text: `${err.message}`,
            }).then(() => this.router.navigateByUrl('/'));
          }
        );
    }
  }
}
