import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MarkdownService } from 'ngx-markdown';

@Component({
  selector: 'app-input-markdown',
  templateUrl: './input-markdown.component.html',
  styleUrls: ['./input-markdown.component.css']
})
export class InputMarkdownComponent {

  @Input() contenidoMarkdown = '';
  @Input() placeholder = 'Texto';

  @Output() changeContent: EventEmitter<string> = new EventEmitter<string>(); 

  constructor(
    private mrkSvc: MarkdownService
  ) {
    
    this.mrkSvc.renderer.image = (href: string, text: string) => {
      return `
        <img src="${href}" alt="${text}" width="100%">
      `
    }
  } 

  inputTextArea() {
    this.changeContent.emit(this.contenidoMarkdown);
  }

}
