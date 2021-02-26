import {
  Component,
  Input,
  OnChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Selector } from '../../models/selector.model';

@Component({
  selector: 'app-selector-multiple',
  templateUrl: './selector-multiple.component.html',
  styleUrls: ['./selector-multiple.component.css'],
})
export class SelectorMultipleComponent implements OnChanges {
  @Input() label = 'Label por defecto';
  @Input() list: Selector[] = [];
  @Input() datosIniciales;
  @Output() selectItems: EventEmitter<string> = new EventEmitter<string>();

  data: Selector[];
  selector = new FormControl();
  firstSelectionOption = 'Seleccionar todos';
  allOptionSelected = false;

  constructor() {}

  ngOnChanges(): void {
    this.data = this.list;

    if (this.datosIniciales) {
      this.selector.patchValue(this.datosIniciales);
    }
  }

  selectAll(): void {
    this.allOptionSelected = !this.allOptionSelected;

    if (this.allOptionSelected) {
      const values = this.data.map((x) => x.id);
      this.selector.patchValue(values);
      this.firstSelectionOption = 'Deseleccionar Todos';
    } else {
      this.selector.patchValue(null);
      this.firstSelectionOption = 'Seleccionar todos';
    }
  }

  onSelectedItems(event: any) {
    if (event.value.includes('0')) {
      this.selectAll();
    }

    if (event.value.length > 0 && this.selector.value !== null) {
      this.selectItems.emit(this.selector.value);
    }
  }
}
