import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { toBase64 } from '../../utilidades';

@Component({
  selector: 'app-input-img',
  templateUrl: './input-img.component.html',
  styleUrls: ['./input-img.component.css']
})
export class InputImgComponent implements OnInit {

  @Input() imagenActual: any;
  @Output() imagenSeleccionada: EventEmitter<File> = new EventEmitter<File>();
  image64: string = null;

  constructor() { }

  ngOnInit(): void {
  }

  change(event: any) {    
    if(event.target.files.length > 0) {
      const file: File = event.target.files[0];

      toBase64(file)
        .then((res: string) => this.image64 = res)
        .catch(err => console.log(err));

      this.imagenSeleccionada.emit(file);
    }
  }

}
