import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'image',
})
export class ImagePipe implements PipeTransform {
  transform(image: string): string {
    if (image) {
      return image;
    } else {
      return './assets/img/no-image-available.png';
    }
  }
}
