import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneroDTO } from '../../../models/generos.model';
import { firstLetterToUpper } from '../../../utilidades';
import { GenerosService } from '../../../services/generos.service';

@Component({
  selector: 'app-generos-edit',
  templateUrl: './generos-edit.component.html',
  styleUrls: ['./generos-edit.component.css']
})
export class GenerosEditComponent implements OnInit {

  editMode = false;
  form: FormGroup;
  genero: GeneroDTO;
  id: number;

  get nombre() {
    return this.form.get('nombre');
  }
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private generoSvc: GenerosService
  ) {

    this.form = this.fb.group({
      nombre: new FormControl('', 
          [Validators.required, Validators.minLength(5), Validators.pattern('^[a-zA-ZA-ZÀ-ÿ.\u00f1\u00d1 ´]*$')])
    });

   }

  ngOnInit(): void {

    this.route.params.subscribe((params:any) => {
      
      if(params['id']) {
        this.editMode = true;
      }

      if(this.editMode) {
         this.id = params['id'];
        
        
        this.generoSvc.obtenerGeneroPorId(this.id)
          .subscribe(data => {

            this.genero = data;
            this.form.patchValue(this.genero)

          }, err => {
            console.log(err);
            this.router.navigateByUrl('/generos');
          })

        };

    });

  }

  mostrarErrores() {
    if(this.nombre) {
      
      if(this.nombre.hasError('required')) {
        return 'El campo Nombre es requerido.';
      }

      if(this.nombre.hasError('minlength')) {
        return `El campo debe tener por lo menos ${this.nombre.errors.minlength?.requiredLength} caracteres.`;
      }

      if(this.nombre.hasError('pattern')) {
        return 'El campo Nombre solo debe tener letras.';
      }

    }

    return '';
  }

  setFirstLetterToUpper() {
    if(this.nombre.value.length > 0 && this.nombre.value.length === 1) {    
      this.nombre?.setValue(firstLetterToUpper(this.nombre.value));
    }
  }

  guardarCambios() {
    const { nombre } = this.form.value;
    
    this.genero = {
      id: this.id, 
      nombre: nombre.trim()
    }
    
    if(this.editMode) {

      this.generoSvc.actualizarGenero(this.id, this.genero)
        .subscribe(() => {
          this.router.navigateByUrl('/generos');
        }, err => console.log(err));

    } else {

      this.generoSvc.crearGenero(this.genero)
      .subscribe((resp) => {
        console.log(resp);
        this.router.navigateByUrl('/generos');
      }, err => console.log(err));

    }
    
  }
}
