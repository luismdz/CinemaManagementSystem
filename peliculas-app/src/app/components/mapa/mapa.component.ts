import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnChanges,
} from '@angular/core';
import {
  tileLayer,
  latLng,
  LeafletMouseEvent,
  marker,
  Marker,
  icon,
} from 'leaflet';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
})
export class MapaComponent implements OnChanges {
  @Input() coordenadas: any;
  @Input() soloLectura = false;
  @Output() coordenadaSeleccionada: EventEmitter<any> = new EventEmitter<any>();

  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...',
      }),
    ],
    zoom: 12,
    center: latLng(18.479344489509398, -69.93834793567659),
  };

  layers: Marker<any>[] = [];

  constructor() {}

  ngOnChanges(): void {
    if (this.coordenadas) {
      this.layers = this.coordenadas.map((coordenada: any) => {
        let marcador = marker([coordenada.latitud, coordenada.longitud], {
          icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: 'assets/marker-icon.png',
            shadowUrl: 'assets/marker-shadow.png',
          }),
        });

        if (coordenada.mensaje) {
          marcador.bindPopup(coordenada.mensaje, {
            autoClose: false,
            autoPan: false,
          });
        }

        return marcador;
      });
    }
  }

  handleClick(event: LeafletMouseEvent) {
    if (!this.soloLectura) {
      const { lat, lng } = event.latlng;

      this.layers = [
        marker([lat, lng], {
          icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: 'assets/marker-icon.png',
            shadowUrl: 'assets/marker-shadow.png',
          }),
        }),
      ];

      this.coordenadaSeleccionada.emit({ lat, lng });
    }
  }
}
